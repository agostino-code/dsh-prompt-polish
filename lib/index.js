import {
  BlockAssembler,
  createUserMessage,
} from '@deepseek-ai/dsh-llm';

function deepFreeze(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    deepFreeze(obj[key]);
  }
  return Object.freeze(obj);
}

export const name = 'dsh-prompt-polish';
export const inject = ['webServer', 'llm'];

const DEFAULT_MAX_TOKENS = 2000;
const DEFAULT_MAX_INPUT_BYTES = 35000;

function terminalError(finish) {
  switch (finish.kind) {
    case 'stop':
      return undefined;
    case 'error':
    case 'aborted': {
      const err = new Error(finish.failure.message);
      err.code = finish.failure.code;
      return err;
    }
    case 'max-tokens':
      return undefined;
    case 'tool-calls':
      return new Error('dsh-prompt-polish: model returned a tool-call; text expected');
    default:
      return new Error(`dsh-prompt-polish: unsupported finish kind ${String(finish.kind)}`);
  }
}

function getSystemPrompt(style, context) {
  const commonInstructions = [
    'You are an expert prompt engineer and writing assistant.',
    'Rewrite the user-provided draft into an optimized, high-quality prompt that an AI model can understand and execute flawlessly.',
    'CRITICAL: Strictly preserve the original language of the draft (e.g. Italian in -> Italian out, English in -> English out, Chinese in -> Chinese out).',
    'Do not invent requirements, change core intent, or fabricate facts.',
    'Return ONLY the raw rewritten prompt text. Do not include commentary, explanations, greetings, quotes, or markdown code fence wrappers (```).'
  ];

  let styleInstructions = '';
  switch (style) {
    case 'concise':
      styleInstructions = [
        'Style: CONCISE.',
        'Eliminate fluff, pleasantries, and redundant words. Keep instructions dense, direct, and unambiguous.'
      ].join('\n');
      break;

    case 'detailed':
      styleInstructions = [
        'Style: DETAILED & STRUCTURED.',
        'Structure the prompt with clear logical sections: Goal / Objective, Specific Requirements, Constraints, and Acceptance Criteria / Expected Output.'
      ].join('\n');
      break;

    case 'code':
      styleInstructions = [
        'Style: CODE & ENGINEERING.',
        'Format the request for software engineering tasks: specify technical context, file paths/signatures if implied, edge cases, error handling, and verification/testing criteria. Preserve code blocks and identifiers verbatim.'
      ].join('\n');
      break;

    case 'balanced':
    default:
      styleInstructions = [
        'Style: BALANCED & PROFESSIONAL.',
        'Organize the draft into a coherent, professional instruction with explicit scope, actionable steps, and clear context.'
      ].join('\n');
      break;
  }

  let contextInstructions = '';
  if (context && (context.cwd || context.goal || (context.todos && context.todos.length > 0) || context.recentContext)) {
    const parts = ['[Active Session Context - for reference only]'];
    if (context.cwd) parts.push(`- Project Workspace Directory: ${context.cwd}`);
    if (context.goal) parts.push(`- Active Goal: ${context.goal}`);
    if (context.todos && context.todos.length > 0) {
      parts.push(`- Current Tasks: ${context.todos.slice(0, 5).join('; ')}`);
    }
    if (context.recentContext) parts.push(`- Recent Discussion: ${context.recentContext.slice(0, 300)}`);
    parts.push(
      'Use the above session context ONLY to clarify ambiguous references (e.g. resolve "the bug" or "this file" to the actual paths or technologies), without hallucinating.'
    );
    contextInstructions = parts.join('\n');
  }

  return [commonInstructions.join('\n'), styleInstructions, contextInstructions].filter(Boolean).join('\n\n');
}

async function readJsonBody(request, maxBytes = 40000) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBytes) throw new Error('request body too large');
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

function sameOrigin(request) {
  const origin = request.headers.origin;
  const host = request.headers.host;
  if (origin === undefined || host === undefined) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function resolveRoute(bodyProvider, bodyModel, config, ctx) {
  if (
    typeof bodyProvider === 'string' &&
    typeof bodyModel === 'string' &&
    bodyProvider.length > 0 &&
    bodyModel.length > 0
  ) {
    return { provider: bodyProvider, model: bodyModel };
  }

  if (
    typeof config.provider === 'string' &&
    typeof config.model === 'string' &&
    config.provider.length > 0 &&
    config.model.length > 0
  ) {
    return { provider: config.provider, model: config.model };
  }

  try {
    const agentDefault = ctx.agentDefaultModel || (typeof ctx.get === 'function' ? ctx.get('agentDefaultModel') : undefined);
    const selection = agentDefault?.currentSelection?.();
    if (selection?.provider && selection?.model) {
      return { provider: selection.provider, model: selection.model };
    }
  } catch {}

  return null;
}

export function apply(ctx, config = {}) {
  const maxTokens = config.maxTokens ?? DEFAULT_MAX_TOKENS;
  const defaultStyle = config.style ?? 'balanced';

  return ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-prompt-polish/polish',
      handler: async (request, response) => {
        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'POST' });
          response.end();
          return;
        }

        if (!sameOrigin(request)) {
          sendJson(response, 403, { error: 'untrusted origin' });
          return;
        }

        let body;
        try {
          body = await readJsonBody(request);
        } catch (e) {
          sendJson(response, 400, { error: e instanceof Error ? e.message : 'invalid body' });
          return;
        }

        const text = typeof body.text === 'string' ? body.text.trim() : '';
        if (text.length === 0) {
          sendJson(response, 400, { error: 'text is required' });
          return;
        }

        if (Buffer.byteLength(text, 'utf8') > DEFAULT_MAX_INPUT_BYTES) {
          sendJson(response, 400, { error: 'text too large (max 35KB)' });
          return;
        }

        const wantsStream =
          body.stream === true ||
          (typeof request.headers.accept === 'string' && request.headers.accept.includes('text/event-stream'));

        const style =
          body.style === 'concise' || body.style === 'detailed' || body.style === 'code' || body.style === 'balanced'
            ? body.style
            : defaultStyle;

        const context = typeof body.context === 'object' && body.context !== null ? body.context : undefined;

        const route = resolveRoute(body.provider, body.model, config, ctx);
        if (route === null) {
          sendJson(response, 400, {
            error: 'no model route available (configure a model in DSH Settings or specify provider/model in plugin config)',
          });
          return;
        }

        const messages = [
          createUserMessage({
            content: [
              {
                type: 'text',
                text: `Draft to polish:\n"""\n${text}\n"""`,
              },
            ],
            source: { kind: 'user' },
          }),
        ];

        const options = deepFreeze({
          provider: route.provider,
          model: route.model,
          messages,
          system: getSystemPrompt(style, context),
          maxTokens,
        });

        if (wantsStream) {
          response.writeHead(200, {
            'content-type': 'text/event-stream; charset=utf-8',
            'cache-control': 'no-cache, no-transform',
            connection: 'keep-alive',
            'x-accel-buffering': 'no',
          });

          let clientClosed = false;
          request.on('close', () => {
            clientClosed = true;
          });

          const assembler = new BlockAssembler();
          try {
            for await (const chunk of ctx.llm.stream(options)) {
              if (clientClosed) break;
              assembler.push(chunk);
              if (chunk.type === 'text-delta' && typeof chunk.text === 'string' && chunk.text.length > 0) {
                response.write(`data: ${JSON.stringify({ type: 'delta', delta: chunk.text })}\n\n`);
              }
            }

            const err = terminalError(assembler.finish);
            if (err !== undefined) throw err;

            const truncated = assembler.finish.kind === 'max-tokens';
            const blocks = assembler.blocks();
            const result = blocks
              .filter((block) => block.type === 'text')
              .map((block) => block.text)
              .join(' ')
              .trim();

            if (!clientClosed) {
              response.write(
                `data: ${JSON.stringify({
                  type: 'done',
                  text: result,
                  truncated,
                  provider: route.provider,
                  model: route.model,
                  style,
                })}\n\n`
              );
              response.end();
            }
          } catch (streamErr) {
            if (!clientClosed) {
              response.write(
                `data: ${JSON.stringify({
                  type: 'error',
                  error: streamErr instanceof Error ? streamErr.message : String(streamErr),
                })}\n\n`
              );
              response.end();
            }
          }
          return;
        }

        // Unary JSON path
        try {
          const assembler = new BlockAssembler();
          for await (const chunk of ctx.llm.stream(options)) {
            assembler.push(chunk);
          }

          const err = terminalError(assembler.finish);
          if (err !== undefined) throw err;

          const truncated = assembler.finish.kind === 'max-tokens';
          const blocks = assembler.blocks();
          if (blocks.some((block) => block.type === 'tool-call')) {
            throw new Error('dsh-prompt-polish: model returned a tool-call; text expected');
          }

          const result = blocks
            .filter((block) => block.type === 'text')
            .map((block) => block.text)
            .join(' ')
            .trim();

          if (result.length === 0) {
            throw new Error('dsh-prompt-polish: no output received from LLM');
          }

          sendJson(response, 200, {
            ok: true,
            text: result,
            truncated,
            provider: route.provider,
            model: route.model,
            style,
          });
        } catch (error) {
          sendJson(response, 400, {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },
    });

    return () => dispose();
  });
}
