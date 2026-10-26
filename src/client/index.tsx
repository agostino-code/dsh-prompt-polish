/**
 * dsh-prompt-polish — browser (client) half for DeepSeek Harness (DSH) 0.2.x.
 *
 * Injects into `conversation.input.right`.
 * Provides:
 * - ✨ Sparkle Polish button with multi-style rewrite (Balanced, Concise, Detailed, Code)
 * - ↩️ Instant Undo button to restore original draft
 * - ⏹️ Abort / Cancel when in-flight
 * - 🌐 Multi-language support (Italian, English, Chinese)
 * - 🎨 DSH native theme token integration
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
      (props: InputRightProps) => (
        <PromptPolishControl
          useInput={props.useInput}
          inputActions={props.inputActions}
          sessionId={props.sessionId}
        />
      ),
    ),
  )
}

const STORAGE_STYLE_KEY = 'dsh_prompt_polish_style'

function PromptPolishControl({
  useInput,
  inputActions,
  sessionId,
}: InputRightProps) {
  const draft = useInput((state) => state.draft) as string | undefined
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [originalDraft, setOriginalDraft] = useState<string | null>(null)
  const [style, setStyle] = useState<PolishStyle>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STYLE_KEY)
      if (saved === 'concise' || saved === 'detailed' || saved === 'code' || saved === 'balanced') {
        return saved as PolishStyle
      }
    } catch {
      // localStorage disabled/inaccessible
    }
    return 'balanced'
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const aliveRef = useRef(true)
  const lang = detectLang()
  const loc = LOCALES[lang]

  useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Auto-dismiss errors after 5 seconds
  useEffect(() => {
    if (error === null) return
    const timer = setTimeout(() => {
      if (aliveRef.current) setError(null)
    }, 5000)
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

  const onCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (aliveRef.current) {
      setBusy(false)
      setError(null)
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

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const resp = await fetch('/dsh-prompt-polish/polish', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text,
          style,
          sessionId,
        }),
        signal: controller.signal,
      })

      const data = (await resp.json()) as {
        ok?: boolean
        text?: string
        error?: string
        truncated?: boolean
      }

      if (resp.ok && data.ok === true && typeof data.text === 'string' && data.text.length > 0) {
        setOriginalDraft(text)
        inputActions.setDraft(data.text)
        if (data.truncated) {
          setError(loc.truncated)
        }
      } else if (data.error) {
        setError(String(data.error))
      } else {
        setError(loc.failed)
      }
    } catch (e: unknown) {
      if ((e as Error)?.name === 'AbortError') {
        // user aborted, ignore
      } else {
        setError(e instanceof Error ? e.message : String(e))
      }
    } finally {
      if (aliveRef.current) {
        setBusy(false)
        abortControllerRef.current = null
      }
    }
  }, [busy, inputActions, text, style, sessionId, loc, onCancel])

  const onUndo = useCallback(() => {
    if (originalDraft !== null && inputActions !== undefined) {
      inputActions.setDraft(originalDraft)
      setOriginalDraft(null)
      setError(null)
    }
  }, [originalDraft, inputActions])

  return (
    <div className="pp-group">
      {/* Style selector */}
      <select
        className="pp-select"
        value={style}
        onChange={handleStyleChange}
        disabled={busy}
        title={loc.styleTooltip || 'Style'}
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

      {/* Error message */}
      {error !== null && (
        <span className="pp-err" role="status" title={error}>
          {error}
        </span>
      )}
    </div>
  )
}
