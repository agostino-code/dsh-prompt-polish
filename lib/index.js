import {
  BlockAssembler,
  createUserMessage,
  deepFreeze,
} from '@deepseek-ai/dsh-llm';

export const name = 'dsh-prompt-polish';
export const inject = ['webServer', 'llm'];

const DEFAULT_MAX_TOKENS = 2000;
const DEFAULT_MAX_INPUT_BYTES = 25000;

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

function getSystemPrompt(style) {
  const commonInstructions = [
    'You are an expert prompt engineer and writing assistant.',
    'Rewrite the user-provided draft into an optimized, high-quality prompt that an AI model can understand and execute flawlessly.',
    'CRITICAL: Strictly preserve the original language of the draft (e.g. Italian in -> Italian out, English in -> English out, Chinese in -> Chinese out).',
    'Do not invent requirements, change core intent, or fabricate facts.',
    'Return ONLY the raw rewritten prompt text. Do not include commentary, explanations, greetings, quotes, or markdown code fence wrappers (```).'
  ];

  switch (style) {
    case 'concise':
      return [
        ...commonInstructions,
        'Style: CONCISE.',
        'Eliminate fluff, pleasantries, and redundant words. Keep instructions dense, direct, and unambiguous.'
      ].join('\n');

    case 'detailed':
      return [
        ...commonInstructions,
        'Style: DETAILED & STRUCTURED.',
        'Structure the prompt with clear logical sections: Goal / Objective, Specific Requirements, Constraints, and Acceptance Criteria / Expected Output.'
      ].join('\n');

    case 'code':
      return [
        ...commonInstructions,
        'Style: CODE & ENGINEERING.',
        'Format the request for software engineering tasks: specify technical context, file paths/signatures if implied, edge cases, error handling, and verification/testing criteria. Preserve code blocks and identifiers verbatim.'
      ].join('\n');

    case 'balanced':
    default:
      return [
        ...commonInstructions,
        'Style: BALANCED & PROFESSIONAL.',
        'Organize the draft into a coherent, professional instruction with explicit scope, actionable steps, and clear context.'
      ].join('\n');
  }
}

async function readJsonBody(request, maxBytes = 32768) {
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
  // 1. Explicit request body override
  if (
    typeof bodyProvider === 'string' &&
    typeof bodyModel === 'string' &&
    bodyProvider.length > 0 &&
    bodyModel.length > 0
  ) {
    return { provider: bodyProvider, model: bodyModel };
  }

  // 2. Explicit plugin config override in cordis.patch.yml
  if (
    typeof config.provider === 'string' &&
    typeof config.model === 'string' &&
    config.provider.length > 0 &&
    config.model.length > 0
  ) {
    return { provider: config.provider, model: config.model };
  }

  // 3. Harness active default model (DSH 0.2 agentDefaultModel service)
  try {
    const agentDefault = ctx.agentDefaultModel || (typeof ctx.get === 'function' ? ctx.get('agentDefaultModel') : undefined);
    const selection = agentDefault?.currentSelection?.();
    if (selection?.provider && selection?.model) {
      return { provider: selection.provider, model: selection.model };
    }
  } catch {
    // Service not loaded or unselected; fall through
  }

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

        try {
          const body = await readJsonBody(request);
          const text = typeof body.text === 'string' ? body.text.trim() : '';
          if (text.length === 0) {
            sendJson(response, 400, { error: 'text is required' });
            return;
          }

          if (Buffer.byteLength(text, 'utf8') > DEFAULT_MAX_INPUT_BYTES) {
            sendJson(response, 400, { error: 'text too large (max 25KB)' });
            return;
          }

          const style =
            body.style === 'concise' || body.style === 'detailed' || body.style === 'code' || body.style === 'balanced'
              ? body.style
              : defaultStyle;

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
            system: getSystemPrompt(style),
            maxTokens,
          });

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
            .join(' ');

          const trimmed = result.trim();
          if (trimmed.length === 0) {
            throw new Error('dsh-prompt-polish: no output received from LLM');
          }

          sendJson(response, 200, {
            ok: true,
            text: trimmed,
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
