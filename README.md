# dsh-prompt-polish (v0.2.1 for DeepSeek Harness 0.2.x)

✨ **DSH Prompt Polish** is a web UI plugin for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness). It adds a sparkle ✨ button right into the composer toolbar to rewrite rough drafts into structured, professional, and unambiguous prompts that an AI model can act upon directly.

This repository is an updated and modernized fork designed for **DSH 0.2.x** (including `0.2.0-rc.2`).

---

## 🚀 Features (v0.2.1)

1. ⚡ **Real-Time Token Streaming (SSE)**: Streams text tokens as the LLM produces them so you can see the result form in real-time.
2. 🔍 **Side-by-Side Diff & Review Modal** (Portaled to `document.body`):
   - Left side: Original user draft.
   - Right side: Polished draft streaming live.
   - **Accept**: Injects optimized prompt directly into composer.
   - **Discard**: Closes without changing the input draft.
   - **Copy**: Copies to clipboard without touching the input draft.
   - **Model Selector**: Change model on the fly directly inside the modal!
3. 🧠 **Session Context Awareness**:
   Toggleable 🧠 **Context** button includes active workspace folder, active session goal, and current tasks/todos to disambiguate references without hallucination.
4. ⚙️ **Integrated DSH Plugins Settings Page**:
   - Access plugin configuration directly from the DSH **Plugins** section (`plugins.row.config` & `plugins.bundle.config`).
   - Dynamically discovers all models available on the host via `GET /dsh-prompt-polish/models`.
   - **Resilient Multi-PC Fallback**: Set to `Automatic` to adapt to whatever models are active on any machine without errors or manual configuration.
5. 🎨 **4 Rewrite Styles**: Balanced, Concise, Detailed, and Code.
6. ↩️ **Instant Undo**: Restore previous draft with 1-click.
7. ⏹️ **In-Flight Cancellation**: Stop generation immediately via `AbortController`.
8. 💅 **Native DSH Design System**: 16×16 monochrome SVG vector icons and rounded buttons strictly conforming to DSH UI tokens.
9. 🌐 **Full i18n & Language Preservation**: Italian, English, and Chinese UI + language preservation.

---

## 📥 Installation

### Method A: Install from GitHub / npm
```bash
dsh plugin --profile web add dsh-prompt-polish
```

### Method B: Install locally for development
```bash
dsh plugin --profile web add link:/path/to/dsh-prompt-polish
```

Then restart `dsh web` and refresh your browser!

---

## ⚙️ Configuration

You can configure Prompt Polish either:
1. In the **DSH Plugins** settings page (`Settings -> Plugins -> dsh-prompt-polish -> Configure`);
2. Or in `$DSH_HOME/profiles/web/cordis.patch.yml`:

```yaml
    - id: prompt-polish
      name: dsh-prompt-polish
      provider: auto      # Or specific provider: proxy, deepseek, ollama, etc.
      model: auto         # Or specific model ID
      style: balanced     # balanced | concise | detailed | code
      maxTokens: 2000
```

---

## 📄 License

MIT. See [LICENSE](./LICENSE).
