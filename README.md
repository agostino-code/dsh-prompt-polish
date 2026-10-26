# dsh-prompt-polish (v0.2.1 for DeepSeek Harness 0.2.x)

✨ **DSH Prompt Polish** is a web UI plugin for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness). It adds a sparkle ✨ button right into the composer toolbar to rewrite rough drafts into structured, professional, and unambiguous prompts that an AI model can act upon directly.

This repository is an updated and modernized fork designed for **DSH 0.2.x** (including `0.2.0-rc.2`).

---

## 🚀 Features (v0.2.1)

1. ⚡ **Real-Time Token Streaming (SSE)**: Streams text tokens as the LLM produces them so you can see the result form in real-time.
2. 🔍 **Side-by-Side Diff & Review Modal**:
   - Left side: Original user draft.
   - Right side: Polished draft streaming live.
   - **Accept**: Copies optimized prompt directly into composer.
   - **Discard**: Closes without changing the input draft.
   - **Copy**: Copies to clipboard without touching the input draft.
3. 🧠 **Session Context Awareness**:
   Toggleable 🧠 **Context** button includes active workspace folder, active session goal, and current tasks/todos to disambiguate references without hallucination.
4. 🤖 **Independent Model Route**: Use any model configured via `cordis.patch.yml` (e.g. fast/cheap `deepseek-chat` or local Ollama) or let DSH use the active default model (`agentDefaultModel`).
5. 🎨 **4 Rewrite Styles**: Balanced, Concise, Detailed, and Code.
6. ↩️ **Instant Undo**: Restore previous draft with 1-click.
7. ⏹️ **In-Flight Cancellation**: Stop generation immediately via `AbortController`.
8. 🌐 **Full i18n & Language Preservation**: Italian, English, and Chinese UI + language preservation.

---

## 📥 Installation

```bash
# Add as a local linked dependency:
dsh plugin --profile web add link:D:\DshPolish
```

Then restart `dsh web` and refresh your browser!

---

## 📄 License

MIT. See [LICENSE](./LICENSE).
