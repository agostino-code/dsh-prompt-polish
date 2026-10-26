/**
 * dsh-prompt-polish — Node (server) half for DeepSeek Harness (DSH) 0.2.x.
 *
 * Registers POST /dsh-prompt-polish/polish: receives { text, style?, provider?, model? },
 * uses the configured or session default LLM model to rewrite a draft into a
 * structured, professional prompt, and returns { ok, text, truncated, provider, model, style }.
 *
 * Model resolution order (adapted for DSH 0.2):
 * 1. Request body { provider, model }
 * 2. Plugin config in cordis.patch.yml
 * 3. ctx.agentDefaultModel.currentSelection() (the DSH profile default model)
 *
 * Styles supported:
 * - 'balanced': Clear, structured, professional, well-rounded (default)
 * - 'concise': Compact, direct, no filler
 * - 'detailed': Full specification with Goal, Requirements, Constraints, Criteria
 * - 'code': Technical and coding-oriented with file paths, edge cases, and tests
 */

import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Context } from '@deepseek-ai/cordis'
import {
  BlockAssembler,
  createUserMessage,
  deepFreeze,
  type FinishReason,
  type GenerateOptions,
  type Message,
} from '@deepseek-ai/dsh-llm'

export const name = 'dsh-prompt-polish'

export const inject = ['webServer', 'llm']

export type PolishStyle = 'balanced' | 'concise' | 'detailed' | 'code'

export interface Config {
  /** Explicit provider override; omit to let DSH use the current default model. */
  provider?: string
  /** Explicit model override. */
  model?: string
  /** Default rewrite style (balanced | concise | detailed | code). */
  style?: PolishStyle
  /** Maximum output tokens for one polish pass. */
  maxTokens?: number
}

const DEFAULT_MAX_TOKENS = 2000
const DEFAULT_MAX_INPUT_BYTES = 25000

function terminalError(finish: FinishReason): Error | undefined {
  switch (finish.kind) {
    case 'stop':
      return undefined
    case 'error':
    case 'aborted': {
      const err = new Error(finish.failure.message) as Error & { code?: string }
      err.code = finish.failure.code
      return err
    }
    case 'max-tokens':
      return undefined
    case 'tool-calls':
      return new Error('dsh-prompt-polish: model returned a tool-call; text expected')
    default:
      return new Error(`dsh-prompt-polish: unsupported finish kind ${String((finish as { kind?: unknown }).kind)}`)
  }
}

function getSystemPrompt(style: PolishStyle): string {
  const commonInstructions = [
    'You are an expert prompt engineer and writing assistant.',
    'Rewrite the user-provided draft into an optimized, high-quality prompt that an AI model can understand and execute flawlessly.',
    'CRITICAL: Strictly preserve the original language of the draft (e.g. Italian in -> Italian out, English in -> English out, Chinese in -> Chinese out).',
    'Do not invent requirements, change core intent, or fabricate facts.',
    'Return ONLY the raw rewritten prompt text. Do not include commentary, explanations, greetings, quotes, or markdown code fence wrappers (```).'
  ]

  switch (style) {
    case 'concise':
      return [
        ...commonInstructions,
        'Style: CONCISE.',
        'Eliminate fluff, pleasantries, and redundant words. Keep instructions dense, direct, and unambiguous.'
      ].join('\n')

    case 'detailed':
      return [
        ...commonInstructions,
        'Style: DETAILED & STRUCTURED.',
        'Structure the prompt with clear logical sections: Goal / Objective, Specific Requirements, Constraints, and Acceptance Criteria / Expected Output.'
      ].join('\n')

    case 'code':
      return [
        ...commonInstructions,
        'Style: CODE & ENGINEERING.',
        'Format the request for software engineering tasks: specify technical context, file paths/signatures if implied, edge cases, error handling, and verification/testing criteria. Preserve code blocks and identifiers verbatim.'
      ].join('\n')

    case 'balanced':
    default:
      return [
        ...commonInstructions,
        'Style: BALANCED & PROFESSIONAL.',
        'Organize the draft into a coherent, professional instruction with explicit scope, actionable steps, and clear context.'
      ].join('\n')
  }
}

async function readJsonBody(request: IncomingMessage, maxBytes = 32768): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > maxBytes) throw new Error('request body too large')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>
}

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, {
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(payload))
}

function sameOrigin(request: IncomingMessage): boolean {
  const origin = request.headers.origin
  const host = request.headers.host
  if (origin === undefined || host === undefined) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function resolveRoute(
  bodyProvider: unknown,
  bodyModel: unknown,
  config: Config,
  ctx: Context
): { provider: string; model: string } | null {
  // 1. Explicit body override
  if (
    typeof bodyProvider === 'string' &&
    typeof bodyModel === 'string' &&
    bodyProvider.length > 0 &&
    bodyModel.length > 0
  ) {
    return { provider: bodyProvider, model: bodyModel }
  }

  // 2. Explicit plugin config override
  if (
    typeof config.provider === 'string' &&
    typeof config.model === 'string' &&
    config.provider.length > 0 &&
    config.model.length > 0
  ) {
    return { provider: config.provider, model: config.model }
  }

  // 3. Harness active default model (DSH 0.2 agentDefaultModel service)
  try {
    const agentDefault = (ctx as unknown as { agentDefaultModel?: { currentSelection(): { provider?: string; model?: string } } }).agentDefaultModel
    const selection = agentDefault?.currentSelection()
    if (selection?.provider && selection?.model) {
      return { provider: selection.provider, model: selection.model }
    }
  } catch {
    // Service not loaded or unselected; fall through
  }

  return null
}

export function apply(ctx: Context, config: Config = {}): unknown {
  const maxTokens = config.maxTokens ?? DEFAULT_MAX_TOKENS
  const defaultStyle: PolishStyle = config.style ?? 'balanced'

  return ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-prompt-polish/polish',
      handler: async (request: IncomingMessage, response: ServerResponse) => {
        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'POST' })
          response.end()
          return
        }

        if (!sameOrigin(request)) {
          sendJson(response, 403, { error: 'untrusted origin' })
          return
        }

        try {
          const body = await readJsonBody(request)
          const text = typeof body.text === 'string' ? body.text.trim() : ''
          if (text.length === 0) {
            sendJson(response, 400, { error: 'text is required' })
            return
          }

          if (Buffer.byteLength(text, 'utf8') > DEFAULT_MAX_INPUT_BYTES) {
            sendJson(response, 400, { error: 'text too large (max 25KB)' })
            return
          }

          const style: PolishStyle =
            body.style === 'concise' || body.style === 'detailed' || body.style === 'code' || body.style === 'balanced'
              ? (body.style as PolishStyle)
              : defaultStyle

          const route = resolveRoute(body.provider, body.model, config, ctx)
          if (route === null) {
            sendJson(response, 400, {
              error: 'no model route available (configure a model in DSH Settings or specify provider/model in plugin config)',
            })
            return
          }

          const messages: Message[] = [
            createUserMessage({
              content: [
                {
                  type: 'text',
                  text: `Draft to polish:\n"""\n${text}\n"""`,
                },
              ],
              source: { kind: 'user' },
            }),
          ]

          const options: GenerateOptions = deepFreeze({
            provider: route.provider,
            model: route.model,
            messages,
            system: getSystemPrompt(style),
            maxTokens,
          })

          const assembler = new BlockAssembler()
          for await (const chunk of ctx.llm.stream(options)) {
            assembler.push(chunk)
          }

          const err = terminalError(assembler.finish)
          if (err !== undefined) throw err

          const truncated = assembler.finish.kind === 'max-tokens'
          const blocks = assembler.blocks()
          if (blocks.some((block) => block.type === 'tool-call')) {
            throw new Error('dsh-prompt-polish: polish returned a tool-call; text only expected')
          }

          const result = blocks
            .filter((block): block is Extract<(typeof blocks)[number], { type: 'text' }> => block.type === 'text')
            .map((block) => block.text)
            .join(' ')

          const trimmed = result.trim()
          if (trimmed.length === 0) {
            throw new Error('dsh-prompt-polish: no output received from LLM')
          }

          sendJson(response, 200, {
            ok: true,
            text: trimmed,
            truncated,
            provider: route.provider,
            model: route.model,
            style,
          })
        } catch (error) {
          sendJson(response, 400, {
            error: error instanceof Error ? error.message : String(error),
          })
        }
      },
    })

    return () => dispose()
  })
}
