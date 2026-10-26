/**
 * dsh-prompt-polish — browser (client) half for DeepSeek Harness (DSH) 0.2.x.
 *
 * Injects into `conversation.input.right`.
 * Provides:
 * - ✨ Sparkle Polish button with SSE real-time streaming
 * - 🔍 Side-by-side Diff / Review modal with Accept, Discard & Copy
 * - 🧠 Context-aware prompt enrichment (cwd, active goal, tasks)
 * - 🎨 4 Rewrite styles (Balanced, Concise, Detailed, Code)
 * - ↩️ Instant Undo button to restore original draft
 * - ⏹️ Abort / Cancel during generation
 * - 🌐 Full i18n (Italian, English, Chinese)
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { InputActions, InputState } from '@deepseek-ai/dsh-client-ui-conversation/client'
import { detectLang, LOCALES, type PolishStyle } from './locales.ts'
import { ensureStyle, PLUGIN } from './styles.ts'

export const name = PLUGIN
export const inject = ['slots']

interface InputRightProps {
  useInput: (selector: (state: InputState) => unknown) => unknown
  inputActions?: InputActions
  sessionId?: string
  useSessions?: (selector: (state: { byId: Record<string, { cwd?: string }> }) => unknown) => unknown
  useProjection?: (key: string) => unknown
}

export function apply(ctx: ClientContext): unknown {
  ensureStyle()

  ctx.slots.inject('conversation.input.right', () =>
    ctx.slots.register(
      {
        id: PLUGIN,
        name: 'conversation.input.right',
        order: 500,
        label: () => 'Prompt Polish',
      },
      (props: InputRightProps) => <PromptPolishControl {...props} />,
    ),
  )
}

const STORAGE_STYLE_KEY = 'dsh_prompt_polish_style'
const STORAGE_CONTEXT_KEY = 'dsh_prompt_polish_context'

function PromptPolishControl({
  useInput,
  inputActions,
  sessionId,
  useSessions,
  useProjection,
}: InputRightProps) {
  const draft = useInput((state) => state.draft) as string | undefined
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [originalDraft, setOriginalDraft] = useState<string | null>(null)

  // Style state
  const [style, setStyle] = useState<PolishStyle>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STYLE_KEY)
      if (saved === 'concise' || saved === 'detailed' || saved === 'code' || saved === 'balanced') {
        return saved as PolishStyle
      }
    } catch {
      // ignore
    }
    return 'balanced'
  })

  // Context-aware toggle
  const [withContext, setWithContext] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_CONTEXT_KEY) !== 'false'
    } catch {
      return true
    }
  })

  // Diff / Review modal state
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewOriginal, setPreviewOriginal] = useState('')
  const [previewPolished, setPreviewPolished] = useState('')
  const [previewStatus, setPreviewStatus] = useState<'streaming' | 'completed' | 'error'>('streaming')
  const [copied, setCopied] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)
  const aliveRef = useRef(true)
  const lang = detectLang()
  const loc = LOCALES[lang]

  // Read session context
  const cwd = useSessions?.((s) => (sessionId ? s.byId[sessionId]?.cwd : undefined)) as string | undefined
  const goalObj = useProjection?.('goal') as { objective?: string } | undefined
  const todosList = useProjection?.('todos') as Array<{ content?: string }> | undefined

  useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (error === null) return
    const timer = setTimeout(() => {
      if (aliveRef.current) setError(null)
    }, 6000)
    return () => clearTimeout(timer)
  }, [error])

  const text = (draft ?? '').trim()
  const disabled = busy || inputActions === undefined || text.length === 0

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as PolishStyle
    setStyle(val)
    try {
      localStorage.setItem(STORAGE_STYLE_KEY, val)
    } catch {
      // ignore
    }
  }

  const toggleContext = () => {
    setWithContext((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_CONTEXT_KEY, String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const onCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (aliveRef.current) {
      setBusy(false)
      setPreviewStatus('completed')
    }
  }, [])

  const onPolish = useCallback(async () => {
    if (busy) {
      onCancel()
      return
    }

    if (inputActions === undefined || text.length === 0) return

    setBusy(true)
    setError(null)
    setPreviewOriginal(text)
    setPreviewPolished('')
    setPreviewStatus('streaming')
    setPreviewOpen(true)
    setCopied(false)

    const controller = new AbortController()
    abortControllerRef.current = controller

    // Assemble context if enabled
    const contextData = withContext
      ? {
          cwd: cwd || undefined,
          goal: goalObj?.objective || undefined,
          todos: Array.isArray(todosList) ? todosList.map((t) => t.content).filter(Boolean) : undefined,
        }
      : undefined

    try {
      const resp = await fetch('/dsh-prompt-polish/polish', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'text/event-stream',
        },
        body: JSON.stringify({
          text,
          style,
          sessionId,
          stream: true,
          context: contextData,
        }),
        signal: controller.signal,
      })

      if (!resp.ok) {
        const errJson = (await resp.json().catch(() => ({}))) as { error?: string }
        throw new Error(errJson.error || `${loc.failed} (${resp.status})`)
      }

      if (!resp.body) {
        throw new Error('No readable response body')
      }

      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue
          const raw = trimmed.slice(5).trim()
          if (!raw) continue

          try {
            const ev = JSON.parse(raw) as {
              type: 'delta' | 'done' | 'error'
              delta?: string
              text?: string
              truncated?: boolean
              error?: string
            }

            if (ev.type === 'delta' && typeof ev.delta === 'string') {
              accumulated += ev.delta
              if (aliveRef.current) {
                setPreviewPolished(accumulated)
              }
            } else if (ev.type === 'done') {
              if (typeof ev.text === 'string' && ev.text.length > 0) {
                accumulated = ev.text
              }
              if (aliveRef.current) {
                setPreviewPolished(accumulated)
                setPreviewStatus('completed')
                if (ev.truncated) setError(loc.truncated)
              }
            } else if (ev.type === 'error') {
              throw new Error(ev.error || loc.failed)
            }
          } catch (parseErr) {
            // Ignore unparsed lines
          }
        }
      }

      if (aliveRef.current) {
        setPreviewStatus('completed')
      }
    } catch (e: unknown) {
      if ((e as Error)?.name === 'AbortError') {
        // user aborted
      } else {
        const msg = e instanceof Error ? e.message : String(e)
        setError(msg)
        if (aliveRef.current) setPreviewStatus('error')
      }
    } finally {
      if (aliveRef.current) {
        setBusy(false)
        abortControllerRef.current = null
      }
    }
  }, [busy, inputActions, text, style, sessionId, withContext, cwd, goalObj, todosList, loc, onCancel])

  const onAccept = () => {
    if (inputActions && previewPolished.trim().length > 0) {
      setOriginalDraft(previewOriginal)
      inputActions.setDraft(previewPolished.trim())
      setPreviewOpen(false)
    }
  }

  const onDiscard = () => {
    if (busy) onCancel()
    setPreviewOpen(false)
  }

  const onCopy = async () => {
    if (!previewPolished) return
    try {
      await navigator.clipboard.writeText(previewPolished)
      setCopied(true)
      setTimeout(() => {
        if (aliveRef.current) setCopied(false)
      }, 2500)
    } catch {
      // fallback
    }
  }

  const onUndo = useCallback(() => {
    if (originalDraft !== null && inputActions !== undefined) {
      inputActions.setDraft(originalDraft)
      setOriginalDraft(null)
      setError(null)
    }
  }, [originalDraft, inputActions])

  return (
    <div className="pp-group">
      {/* Context-aware toggle pill */}
      <button
        type="button"
        className={`pp-btn pp-btn-toggle ${withContext ? 'pp-btn-toggle-active' : ''}`}
        onClick={toggleContext}
        title={loc.contextTooltip}
        aria-label={loc.context}
      >
        <span className="pp-icon" aria-hidden="true">
          🧠
        </span>
        <span>{loc.context}</span>
      </button>

      {/* Style selector */}
      <select
        className="pp-select"
        value={style}
        onChange={handleStyleChange}
        disabled={busy}
        title={loc.styleTooltip}
        aria-label="Style"
      >
        <option value="balanced">{loc.styles.balanced}</option>
        <option value="concise">{loc.styles.concise}</option>
        <option value="detailed">{loc.styles.detailed}</option>
        <option value="code">{loc.styles.code}</option>
      </select>

      {/* Polish / Cancel button */}
      <button
        type="button"
        className={`pp-btn ${busy ? 'pp-btn-busy' : ''}`}
        disabled={disabled && !busy}
        onClick={() => {
          void onPolish()
        }}
        title={busy ? loc.cancelTooltip : loc.tooltip}
        aria-label={busy ? loc.cancel : loc.polish}
      >
        {busy ? (
          <span className="pp-spin" aria-hidden="true" />
        ) : (
          <span className="pp-icon" aria-hidden="true">
            ✨
          </span>
        )}
        <span className="pp-text">{busy ? ` ${loc.cancel}` : ` ${loc.polish}`}</span>
      </button>

      {/* Undo button */}
      {originalDraft !== null && !busy && (
        <button
          type="button"
          className="pp-btn pp-btn-undo"
          onClick={onUndo}
          title={loc.undoTooltip}
          aria-label={loc.undo}
        >
          <span className="pp-icon" aria-hidden="true">
            ↩️
          </span>
          <span className="pp-text">{loc.undo}</span>
        </button>
      )}

      {/* Error badge */}
      {error !== null && (
        <span className="pp-err" role="status" title={error}>
          {error}
        </span>
      )}

      {/* Diff / Review Modal */}
      {previewOpen && (
        <div className="pp-modal-backdrop" onClick={onDiscard}>
          <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="pp-modal-head">
              <span>{loc.previewTitle}</span>
              <button
                type="button"
                className="pp-modal-close"
                onClick={onDiscard}
                title={loc.reject}
              >
                ✕
              </button>
            </div>

            {/* Body (Side-by-side) */}
            <div className="pp-modal-body">
              {/* Left pane: Original */}
              <div className="pp-pane">
                <div className="pp-pane-head">
                  <span>{loc.original}</span>
                </div>
                <div className="pp-pane-content">{previewOriginal}</div>
              </div>

              {/* Right pane: AI Polished */}
              <div className="pp-pane">
                <div className="pp-pane-head">
                  <span>{loc.polished}</span>
                  {previewStatus === 'streaming' && (
                    <span className="pp-spin" aria-hidden="true" style={{ width: 10, height: 10 }} />
                  )}
                </div>
                <div className="pp-pane-content">
                  {previewPolished || (previewStatus === 'streaming' ? '…' : '')}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pp-modal-foot">
              <div className="pp-foot-status">
                {previewStatus === 'streaming' ? (
                  <>
                    <span className="pp-spin" aria-hidden="true" />
                    <span>{loc.streaming}</span>
                  </>
                ) : (
                  <span>
                    {withContext ? '🧠 Context-Aware · ' : ''}
                    {loc.completed}
                  </span>
                )}
              </div>

              <div className="pp-foot-actions">
                <button
                  type="button"
                  className="pp-action-btn"
                  onClick={onCopy}
                  disabled={!previewPolished}
                >
                  {copied ? loc.copied : loc.copy}
                </button>
                <button type="button" className="pp-action-btn" onClick={onDiscard}>
                  {loc.reject}
                </button>
                <button
                  type="button"
                  className="pp-action-btn pp-action-btn-primary"
                  onClick={onAccept}
                  disabled={!previewPolished}
                >
                  {loc.accept}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
