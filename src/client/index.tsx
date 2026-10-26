/**
 * dsh-prompt-polish — browser (client) half for DeepSeek Harness (DSH) 0.2.x.
 *
 * Injects into `conversation.input.right`.
 * Provides:
 * - 🧠 Context-aware prompt enrichment (workspace path, active goal, tasks)
 * - ✨ Sparkle Polish button with SSE real-time streaming
 * - 🔍 Side-by-side Diff / Review modal with Accept, Discard & Copy (portaled to document.body)
 * - 🎨 4 Rewrite styles (Balanced, Concise, Detailed, Code)
 * - ↩️ Instant Undo button to restore original draft
 * - ⏹️ Abort / Cancel during generation
 * - 🌐 Full i18n (Italian, English, Chinese)
 * - 💅 Native DSH ghost style: horizontal layout, 16px monochrome gray icons, transparent background, interactive hover
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { InputActions, InputState } from '@deepseek-ai/dsh-client-ui-conversation/client'
import { detectLang, LOCALES, type PolishStyle } from './locales.ts'
import { ensureStyle, PLUGIN } from './styles.ts'

export const name = PLUGIN
export const inject = ['slots']

interface WorkspaceItem {
  workspaceId?: string
  path?: string
  title?: string
  sessionIds?: readonly string[]
}

interface InputRightProps {
  useInput: (selector: (state: InputState) => unknown) => unknown
  inputActions?: InputActions
  sessionId?: string
  useWorkspaces?: (selector: (state: { items?: readonly WorkspaceItem[] }) => unknown) => unknown
  useSessions?: (selector: (state: { byId?: Record<string, { cwd?: string }> }) => unknown) => unknown
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

// Native DSH style 16x16 monochrome SVG icons
// IconContextInjectionOutlineRegular (exact DSH geometry)
function IconContextInjection() {
  return (
    <svg viewBox="0 0 16 16" className="pp-icon-svg" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1">
      <path d="M2.5 7.5L5.5 10.5L13.5 2.5" />
      <path d="M5.5 5L8 7.5L10.5 5" />
      <path d="M5.5 11H10.5" />
    </svg>
  )
}

// IconEnhanceOutlineRegular (exact DSH geometry)
function IconEnhance() {
  return (
    <svg viewBox="0 0 16 16" className="pp-icon-svg" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1">
      <path d="M1.98486 2.95374H14.0151" />
      <path d="M1.98486 6.31787H14.0151" />
      <path d="M1.98486 9.68213H14.0151" />
      <path d="M1.98486 13.0463H8.4627" />
    </svg>
  )
}

// IconListPenOutlineRegular (exact DSH geometry)
function IconUndo() {
  return (
    <svg viewBox="0 0 16 16" className="pp-icon-svg" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1">
      <path d="M4.5 5.5H12.5" />
      <path d="M4.5 8.5H10.5" />
      <path d="M4.5 11.5H8.5" />
      <path d="M2.5 5.5H2.51" />
      <path d="M2.5 8.5H2.51" />
      <path d="M2.5 11.5H2.51" />
    </svg>
  )
}

// IconChevronDownOutlineRegular (exact DSH geometry)
function IconChevronDown() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.2">
      <path d="M3.5 6L8 10.5L12.5 6" />
    </svg>
  )
}

function PromptPolishControl({
  useInput,
  inputActions,
  sessionId,
  useWorkspaces,
  useSessions,
  useProjection,
}: InputRightProps) {
  const draft = useInput((state) => state.draft) as string | undefined
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [originalDraft, setOriginalDraft] = useState<string | null>(null)

  // Style selection
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

  // Context-aware toggle state
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

  // Extract session context through DSH hooks
  const workspacesList = useWorkspaces?.((s) => s.items) as readonly WorkspaceItem[] | undefined
  const matchedWorkspace = workspacesList?.find(
    (w) => (sessionId ? w.sessionIds?.includes(sessionId) : false)
  ) || workspacesList?.[0]
  const resolvedCwd = matchedWorkspace?.path || matchedWorkspace?.title

  const sessionCwd = useSessions?.((s) => (sessionId && s.byId ? s.byId[sessionId]?.cwd : undefined)) as string | undefined
  const activeCwd = resolvedCwd || sessionCwd

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

    const contextData = withContext
      ? {
          cwd: activeCwd || undefined,
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
            // ignore malformed lines
          }
        }
      }

      if (aliveRef.current) {
        setPreviewStatus('completed')
      }
    } catch (e: unknown) {
      if ((e as Error)?.name === 'AbortError') {
        // user cancelled
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
  }, [busy, inputActions, text, style, sessionId, withContext, activeCwd, goalObj, todosList, loc, onCancel])

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

  // Portaled Modal JSX (rendered onto document.body to avoid breaking composer bar layout)
  const modalPortal =
    previewOpen && typeof document !== 'undefined'
      ? createPortal(
          <div className="pp-modal-backdrop" onClick={onDiscard}>
            <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
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

              {/* Modal Body: Side-by-side comparison */}
              <div className="pp-modal-body">
                {/* Left pane: Original draft */}
                <div className="pp-pane">
                  <div className="pp-pane-head">
                    <span>{loc.original}</span>
                  </div>
                  <div className="pp-pane-content">{previewOriginal}</div>
                </div>

                {/* Right pane: AI Polished draft (live streaming) */}
                <div className="pp-pane">
                  <div className="pp-pane-head">
                    <span>{loc.polished}</span>
                    {previewStatus === 'streaming' && (
                      <span
                        className="pp-spin"
                        aria-hidden="true"
                        style={{ width: 10, height: 10 }}
                      />
                    )}
                  </div>
                  <div className="pp-pane-content">
                    {previewPolished || (previewStatus === 'streaming' ? '…' : '')}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
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
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <div className="pp-group">
        {/* Native DSH trigger: Context Toggle */}
        <button
          type="button"
          className={`pp-btn ${withContext ? 'pp-btn-context-active' : 'pp-btn-context-inactive'}`}
          onClick={toggleContext}
          title={withContext ? loc.contextTooltipActive : loc.contextTooltipInactive}
          aria-label={loc.context}
          aria-pressed={withContext}
        >
          <IconContextInjection />
          <span>{loc.context}</span>
          <span
            className={`pp-context-dot ${withContext ? '' : 'pp-context-dot-off'}`}
            aria-hidden="true"
          />
        </button>

        {/* Native DSH trigger: Style dropdown with custom chevron */}
        <div className="pp-select-wrapper">
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
          <span className="pp-select-chevron" aria-hidden="true">
            <IconChevronDown />
          </span>
        </div>

        {/* Native DSH trigger: Polish / Cancel action */}
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
          {busy ? <span className="pp-spin" aria-hidden="true" /> : <IconEnhance />}
          <span>{busy ? loc.cancel : loc.polish}</span>
        </button>

        {/* Native DSH trigger: Undo button */}
        {originalDraft !== null && !busy && (
          <button
            type="button"
            className="pp-btn"
            onClick={onUndo}
            title={loc.undoTooltip}
            aria-label={loc.undo}
          >
            <IconUndo />
            <span>{loc.undo}</span>
          </button>
        )}

        {/* Error status notice */}
        {error !== null && (
          <span className="pp-err" role="status" title={error}>
            {error}
          </span>
        )}
      </div>

      {/* Body-portaled modal (does not touch or break the input bar layout) */}
      {modalPortal}
    </>
  )
}
