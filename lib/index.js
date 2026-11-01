import z from '@deepseek-ai/schemastery';
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

export const Config = z.object({
  provider: z.string().default('auto').description('LLM provider ID for prompt polish (or "auto" for active DSH model)'),
  model: z.string().default('auto').description('LLM model ID for prompt polish (or "auto" for active DSH model)'),
  style: z.union([z.const('balanced'), z.const('concise'), z.const('detailed'), z.const('code')]).default('balanced'),
  maxTokens: z.number().default(2000),
});

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

function getSystemPrompt(style, context, outputLang = 'auto') {
  const languageRule =
    outputLang === 'en'
      ? 'CRITICAL: Regardless of the language of the draft, produce the final polished prompt in English. Faithfully translate any non-English content (keep code, identifiers, file paths and technical terms verbatim).'
      : 'CRITICAL: Strictly preserve the original language of the draft (e.g. Italian in -> Italian out, English in -> English out, Chinese in -> Chinese out).';

  const commonInstructions = [
    'You are an expert prompt engineer and writing assistant.',
    'Rewrite the user-provided draft into an optimized, high-quality prompt that an AI model can understand and execute flawlessly.',
    languageRule,
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
  if (context && (context.cwd || context.goal || (context.todos && context.todos.length > 0) || context.recentContext || (context.recentPrompts && context.recentPrompts.length > 0) || context.projectOverview)) {
    const parts = ['[Active Session Context - for reference only]'];
    if (context.cwd) parts.push(`- Project Workspace Directory: ${context.cwd}`);
    if (context.projectOverview) parts.push(`- Project Overview:\n${context.projectOverview}`);
    if (context.goal) parts.push(`- Active Goal: ${context.goal}`);
    if (context.todos && context.todos.length > 0) {
      parts.push(`- Current Tasks: ${context.todos.slice(0, 5).join('; ')}`);
    }
    if (context.recentPrompts && context.recentPrompts.length > 0) {
      parts.push(`- Recent User Prompts (oldest to newest):\n${context.recentPrompts.map((p) => `  * ${p}`).join('\n')}`);
    }
    if (context.recentContext) parts.push(`- Recent Discussion: ${context.recentContext.slice(0, 300)}`);
    parts.push(
      'Use the above session context ONLY to clarify ambiguous references (e.g. resolve "the bug" or "this file" to the actual paths or technologies) and to keep terminology, naming and scope coherent with the project. Do not hallucinate or invent facts.'
    );
    contextInstructions = parts.join('\n');
  }

  return [commonInstructions.join('\n'), styleInstructions, contextInstructions].filter(Boolean).join('\n\n');
}

/**
 * Collect the last few user prompts from the session log (server-side),
 * so the polished prompt stays coherent with what the user has been asking.
 */
function collectRecentPrompts(ctx, sessionId, limit = 5) {
  if (typeof sessionId !== 'string' || sessionId.length === 0) return [];
  try {
    const session = ctx.sessions?.get(sessionId);
    if (!session) return [];
    const messages = session.deriveMessages();
    const prompts = [];
    for (let i = messages.length - 1; i >= 0 && prompts.length < limit; i--) {
      const msg = messages[i];
      if (msg.role !== 'user') continue;
      const text = msg.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join(' ')
        .trim();
      if (text.length === 0) continue;
      prompts.unshift(text.length > 200 ? `${text.slice(0, 200)}…` : text);
    }
    return prompts;
  } catch {
    return [];
  }
}

/**
 * Build a compact project overview (manifest, README head, root layout)
 * so the polished prompt never proposes something incoherent with the project.
 */
async function buildProjectOverview(cwd) {
  const fsP = await import('node:fs/promises');
  const pathP = await import('node:path');
  const root = pathP.resolve(cwd);
  const parts = [];

  const readFileSafe = async (rel, maxBytes) => {
    try {
      const buf = await fsP.readFile(pathP.join(root, rel));
      const text = buf.subarray(0, maxBytes).toString('utf8');
      return text.trim() || undefined;
    } catch {
      return undefined;
    }
  };

  const manifestRaw = await readFileSafe('package.json', 4000);
  if (manifestRaw) {
    try {
      const pkg = JSON.parse(manifestRaw);
      const bits = [];
      if (pkg.name) bits.push(`name: ${pkg.name}`);
      if (pkg.description) bits.push(`description: ${pkg.description}`);
      const deps = Object.keys(pkg.dependencies ?? {}).slice(0, 12);
      if (deps.length > 0) bits.push(`dependencies: ${deps.join(', ')}`);
      const scripts = Object.keys(pkg.scripts ?? {}).slice(0, 8);
      if (scripts.length > 0) bits.push(`scripts: ${scripts.join(', ')}`);
      if (bits.length > 0) parts.push(`package.json → ${bits.join(' | ')}`);
    } catch {}
  }

  const pyproject = await readFileSafe('pyproject.toml', 1500);
  if (pyproject) {
    const nameMatch = pyproject.match(/name\s*=\s*"([^"]+)"/);
    const descMatch = pyproject.match(/description\s*=\s*"([^"]+)"/);
    const bits = [];
    if (nameMatch) bits.push(`name: ${nameMatch[1]}`);
    if (descMatch) bits.push(`description: ${descMatch[1]}`);
    if (bits.length > 0) parts.push(`pyproject.toml → ${bits.join(' | ')}`);
  }

  const cargo = await readFileSafe('Cargo.toml', 1500);
  if (cargo) {
    const nameMatch = cargo.match(/^name\s*=\s*"?([^"\n]+)"?/m);
    const descMatch = cargo.match(/^description\s*=\s*"?([^"\n]+)"?/m);
    const bits = [];
    if (nameMatch) bits.push(`name: ${nameMatch[1]}`);
    if (descMatch) bits.push(`description: ${descMatch[1]}`);
    if (bits.length > 0) parts.push(`Cargo.toml → ${bits.join(' | ')}`);
  }

  for (const readme of ['README.md', 'README.rst', 'readme.md']) {
    const text = await readFileSafe(readme, 700);
    if (text) {
      const head = text.replace(/\s+/g, ' ').slice(0, 500);
      parts.push(`${readme} (excerpt): ${head}`);
      break;
    }
  }

  try {
    const entries = await fsP.readdir(root, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.')).map((e) => `${e.name}/`);
    const files = entries.filter((e) => e.isFile() && !e.name.startsWith('.')).map((e) => e.name);
    const layout = [...dirs.slice(0, 15), ...files.slice(0, 15)].join(', ');
    if (layout) parts.push(`Root layout: ${layout}`);
  } catch {}

  if (parts.length === 0) return undefined;
  return parts.join('\n').slice(0, 1500);
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

async function listAvailableModels(ctx) {
  const models = [];
  try {
    const providers = ctx.llm.listProviders();
    for (const p of providers) {
      try {
        const pModels = await ctx.llm.listModels(p.id);
        for (const m of pModels) {
          models.push({
            provider: p.id,
            model: m.id,
            name: m.name ? `${m.name} (${p.name || p.id})` : `${m.id} (${p.name || p.id})`,
          });
        }
      } catch {
        // provider query failed
      }
    }
  } catch {}

  let defaultSelection = null;
  try {
    const agentDefault = ctx.agentDefaultModel;
    const sel = agentDefault?.currentSelection();
    if (sel?.provider && sel?.model) {
      defaultSelection = { provider: sel.provider, model: sel.model };
    }
  } catch {}

  return { models, defaultSelection };
}

async function resolveRoute(bodyProvider, bodyModel, config, ctx) {
  // 1. Explicit request body (from user UI picker)
  if (
    typeof bodyProvider === 'string' &&
    typeof bodyModel === 'string' &&
    bodyProvider.length > 0 &&
    bodyModel.length > 0 &&
    bodyProvider !== 'auto' &&
    bodyModel !== 'auto'
  ) {
    return { provider: bodyProvider, model: bodyModel };
  }

  // 2. Plugin config (if specified and not 'auto')
  if (
    typeof config.provider === 'string' &&
    typeof config.model === 'string' &&
    config.provider.length > 0 &&
    config.model.length > 0 &&
    config.provider !== 'auto' &&
    config.model !== 'auto'
  ) {
    return { provider: config.provider, model: config.model };
  }

  // 3. Fallback to active agent default model on current host
  try {
    const agentDefault = ctx.agentDefaultModel;
    const selection = agentDefault?.currentSelection();
    if (selection?.provider && selection?.model) {
      return { provider: selection.provider, model: selection.model };
    }
  } catch {}

  // 4. Fallback to first available model from any registered provider
  try {
    const providers = ctx.llm.listProviders();
    for (const p of providers) {
      try {
        const pModels = await ctx.llm.listModels(p.id);
        if (pModels.length > 0) {
          return { provider: p.id, model: pModels[0].id };
        }
      } catch {}
    }
  } catch {}

  return null;
}

export function apply(ctx, config = {}) {
  const maxTokens = config.maxTokens ?? DEFAULT_MAX_TOKENS;
  const defaultStyle = config.style ?? 'balanced';

  return ctx.effect(() => {
    // 1. Model Discovery Endpoint
    const disposeModels = ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-prompt-polish/models',
      handler: async (request, response) => {
        if (request.method !== 'GET') {
          response.writeHead(405, { allow: 'GET' });
          response.end();
          return;
        }

        const { models, defaultSelection } = await listAvailableModels(ctx);
        sendJson(response, 200, {
          models,
          defaultSelection,
          configured: {
            provider: config.provider || 'auto',
            model: config.model || 'auto',
            style: config.style || 'balanced',
          },
        });
      },
    });

    // 2. Prompt Polish Endpoint
    const disposePolish = ctx.webServer.register({
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

        // Server-side context enrichment: recent prompts (session log) + project overview (filesystem)
        if (context) {
          const recentPrompts = collectRecentPrompts(ctx, body.sessionId);
          if (recentPrompts.length > 0) context.recentPrompts = recentPrompts;
          if (context.cwd) {
            try {
              const overview = await buildProjectOverview(context.cwd);
              if (overview) context.projectOverview = overview;
            } catch {}
          }
        }
        const outputLang = body.outputLang === 'en' ? 'en' : 'auto';

        const route = await resolveRoute(body.provider, body.model, config, ctx);
        if (route === null) {
          sendJson(response, 400, {
            error: 'no model route available (configure a model in DSH Settings or specify provider/model in plugin config)',
          });
          return;
        }

        const langDirective =
          outputLang === 'en'
            ? 'Produce the final polished prompt strictly in ENGLISH (translate non-English text to English while preserving code, identifiers, and paths verbatim).'
            : 'Strictly preserve the original language of the draft.';

        const messages = [
          createUserMessage({
            content: [
              {
                type: 'text',
                text: `Target output language: ${outputLang === 'en' ? 'ENGLISH' : 'SAME AS DRAFT'}\n${langDirective}\n\nDraft to polish:\n"""\n${text}\n"""`,
              },
            ],
            source: { kind: 'user' },
          }),
        ];

        const options = deepFreeze({
          provider: route.provider,
          model: route.model,
          messages,
          system: getSystemPrompt(style, context, outputLang),
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

    return () => {
      disposeModels();
      disposePolish();
    };
  });
}
