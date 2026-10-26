# dsh-prompt-polish (v0.2.0 for DeepSeek Harness 0.2.x)

✨ **DSH Prompt Polish** is a web UI plugin for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness). It adds a sparkle ✨ button right into the composer toolbar to rewrite rough drafts into structured, professional, and unambiguous prompts that an AI model can act upon directly.

This repository is an updated and modernized fork designed for **DSH 0.2.x** (including `0.2.0-rc.2`).

---

## 🔍 Why the original 0.1.0 version failed on DSH 0.2

1. **Peer dependency constraints**:
   - `dsh-prompt-polish` 0.1.0 pinned `@deepseek-ai/dsh-llm: ^0.1.0`. DSH 0.2 ships with `0.2.0-rc.2`, leading to package manager peer dependency errors.
2. **Hardcoded OpenRouter configuration**:
   - `cordis.patch.yml` hardcoded `provider: openrouter` and `model: deepseek/deepseek-v4-flash-0731`. Users without OpenRouter configured in DSH received `400: no model route available` or authentication failures.
3. **Missing `agentDefaultModel` integration**:
   - In DSH 0.2, the active default model is managed via `ctx.agentDefaultModel.currentSelection()`. Version 0.1.0 didn't read this service.
4. **Outdated message source schema**:
   - Used `source: { kind: 'plugin' }`, which was deprecated in DSH 0.2 in favor of the standard `{ kind: 'user' }` taxonomy.
5. **Missing `"immediately": true` in client manifest**:
   - DSH 0.2 expects `"immediately": true` in `dsh.client` for immediate web client module hydration.
6. **No multi-style or Undo capabilities**:
   - Only 1 hardcoded rewrite style and no way to revert if the user disliked the outcome.

---

## 🚀 New Features & Enhancements (v0.2.0)

- 🧠 **Automatic DSH Model Resolution**:
  Zero configuration required! Automatically leverages the default model already configured in your DSH Settings (`agentDefaultModel`). You can still override it if needed.
- 🎨 **4 Rewrite Styles**:
  - **Balanced**: Professional, well-rounded, structured (default).
  - **Concise**: Punchy, direct, eliminates fluff and filler.
  - **Detailed**: Full specification with Goal, Requirements, Constraints, and Acceptance Criteria.
  - **Code**: Tailored for software engineering (paths, error handling, edge cases, tests).
- ↩️ **Instant Undo**:
  An undo button appears right after polishing, allowing you to restore your previous draft with a single click.
- ⏹️ **In-Flight Cancellation**:
  Clicking the spinner button while polishing aborts the request immediately via `AbortController`.
- 🌐 **Full i18n & Language Preservation**:
  - UI in Italian, English, and Chinese based on browser language.
  - The system prompt strictly preserves the language of the user's input (Italian in -> Italian out, etc.).
- 💅 **DSH Design System Integration**:
  Uses DSH CSS theme tokens for seamless dark and light mode support.
- 📦 **Prebuilt distribution**:
  Ships clean, verified `lib/index.js` and `lib/client.js` in `window.__ModuleLoader__` format.

---

## 📥 Installation

```bash
# Add as a local linked dependency:
dsh plugin --profile web add link:D:\DshPolish

# Or add the directory:
dsh plugin --profile web add D:\DshPolish
```

Then restart `dsh web` (or restart the service) and reload your browser!

---

## ⚙️ Configuration (Optional `cordis.patch.yml`)

```yaml
- insert:
    - id: prompt-polish
      name: 'dsh-prompt-polish'
      config:
        style: balanced       # balanced | concise | detailed | code
        maxTokens: 2000       # output token limit
        # provider: deepseek  # optional explicit provider override
        # model: deepseek-chat# optional explicit model override
```

---

## 💡 Suggested Future Improvements

1. **Real-time SSE streaming**: Stream rewritten tokens directly into the input area.
2. **Side-by-side diff preview**: Display a comparison popover with "Accept" / "Reject" controls.
3. **Keyboard shortcut**: Trigger polish with `Ctrl+Shift+P` or `Alt+P` directly from the editor.
4. **Session context awareness**: Optionally include recent message context or active files.

---

## 📄 License

MIT. See [LICENSE](./LICENSE).
