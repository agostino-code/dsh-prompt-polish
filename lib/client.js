window.__ModuleLoader__.load({
  id: "dsh-prompt-polish",
  factory: (require) => {
    const React = require("react");
    const h = React.createElement;

    const PLUGIN = "dsh-prompt-polish";
    const STYLE_ID = "dsh-prompt-polish-style";
    const STORAGE_STYLE_KEY = "dsh_prompt_polish_style";
    const STORAGE_CONTEXT_KEY = "dsh_prompt_polish_context";

    const CSS = `
#dsh-prompt-polish-style .pp-group {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  position: relative;
  font-family: inherit;
  font-size: 12px;
}
#dsh-prompt-polish-style .pp-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.28));
  border-radius: var(--dsw-radius-sm, 6px);
  background: transparent;
  color: var(--dsw-alias-label-secondary, inherit);
  font-size: 12px;
  line-height: 1;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  user-select: none;
}
#dsh-prompt-polish-style .pp-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
  border-color: var(--dsw-focus-ring-color, #4a7cff);
  color: var(--dsw-alias-label-primary, inherit);
}
#dsh-prompt-polish-style .pp-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  border-color: var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.2));
}
#dsh-prompt-polish-style .pp-btn-busy {
  border-color: #ff9800;
  color: var(--dsw-alias-label-primary, inherit);
}
#dsh-prompt-polish-style .pp-btn-busy:hover {
  background: rgba(255, 152, 0, 0.12) !important;
  border-color: #f44336 !important;
}
#dsh-prompt-polish-style .pp-btn-undo {
  padding: 0 6px;
  border-color: var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.3));
}
#dsh-prompt-polish-style .pp-btn-undo:hover {
  border-color: #10b981;
  color: #10b981;
}
#dsh-prompt-polish-style .pp-btn-toggle {
  padding: 0 6px;
  font-size: 11px;
}
#dsh-prompt-polish-style .pp-btn-toggle-active {
  background: rgba(74, 124, 255, 0.15) !important;
  border-color: #4a7cff !important;
  color: #4a7cff !important;
}
#dsh-prompt-polish-style .pp-select {
  height: 28px;
  padding: 0 4px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.28));
  border-radius: var(--dsw-radius-sm, 6px);
  background: transparent;
  color: var(--dsw-alias-label-secondary, inherit);
  font-size: 11px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;
}
#dsh-prompt-polish-style .pp-select:hover {
  border-color: var(--dsw-focus-ring-color, #4a7cff);
}
#dsh-prompt-polish-style .pp-select option {
  background: var(--dsw-alias-bg-surface-l1, #1e1e1e);
  color: var(--dsw-alias-label-primary, #ffffff);
}
#dsh-prompt-polish-style .pp-spin {
  width: 12px;
  height: 12px;
  border: 2px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.4));
  border-top-color: transparent;
  border-radius: 50%;
  animation: ppSpin 0.7s linear infinite;
  display: inline-block;
  flex: none;
}
#dsh-prompt-polish-style .pp-icon {
  font-size: 13px;
  line-height: 1;
  display: inline-block;
}
#dsh-prompt-polish-style .pp-err {
  font-size: 11px;
  color: var(--dsw-alias-state-error-primary, #e5484d);
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 4px;
}

/* Modal Diff & Review Overlay */
#dsh-prompt-polish-style .pp-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ppFadeIn 0.15s ease;
}
#dsh-prompt-polish-style .pp-modal {
  background: var(--dsw-alias-bg-surface-l1, #1e1e1e);
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.25));
  border-radius: var(--dsw-radius-md, 10px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  color: var(--dsw-alias-label-primary, #e0e0e0);
  width: min(880px, 95vw);
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ppScaleUp 0.15s ease;
}
#dsh-prompt-polish-style .pp-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.18));
  font-size: 14px;
  font-weight: 600;
}
#dsh-prompt-polish-style .pp-modal-close {
  background: transparent;
  border: none;
  font-size: 18px;
  line-height: 1;
  color: var(--dsw-alias-label-tertiary, #888);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}
#dsh-prompt-polish-style .pp-modal-close:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.15));
  color: var(--dsw-alias-label-primary, #fff);
}
#dsh-prompt-polish-style .pp-modal-body {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 14px;
  padding: 14px 16px;
  overflow-y: auto;
  flex: 1;
  min-height: 240px;
  max-height: calc(86vh - 120px);
}
@media (max-width: 680px) {
  #dsh-prompt-polish-style .pp-modal-body {
    grid-template-columns: 1fr;
  }
}
#dsh-prompt-polish-style .pp-pane {
  display: flex;
  flex-direction: column;
  background: var(--dsw-alias-bg-surface-l2, rgba(0, 0, 0, 0.2));
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.2));
  border-radius: var(--dsw-radius-sm, 6px);
  overflow: hidden;
}
#dsh-prompt-polish-style .pp-pane-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--dsw-alias-bg-surface-l3, rgba(255, 255, 255, 0.04));
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.15));
  color: var(--dsw-alias-label-secondary, #aaa);
}
#dsh-prompt-polish-style .pp-pane-content {
  padding: 10px 12px;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-y: auto;
  flex: 1;
  user-select: text;
}
#dsh-prompt-polish-style .pp-modal-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.18));
  background: var(--dsw-alias-bg-surface-l2, rgba(0, 0, 0, 0.15));
  gap: 10px;
}
#dsh-prompt-polish-style .pp-foot-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, #aaa);
}
#dsh-prompt-polish-style .pp-foot-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
#dsh-prompt-polish-style .pp-action-btn {
  height: 30px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--dsw-radius-sm, 6px);
  cursor: pointer;
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.28));
  background: transparent;
  color: var(--dsw-alias-label-primary, inherit);
  transition: all 0.15s ease;
}
#dsh-prompt-polish-style .pp-action-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.15));
}
#dsh-prompt-polish-style .pp-action-btn-primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}
#dsh-prompt-polish-style .pp-action-btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}
@keyframes ppSpin {
  to { transform: rotate(360deg); }
}
@keyframes ppFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ppScaleUp {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
`;

    function ensureStyle() {
      if (typeof document === "undefined") return;
      if (document.getElementById(STYLE_ID) !== null) return;
      const tag = document.createElement("style");
      tag.id = STYLE_ID;
      tag.dataset.plugin = PLUGIN;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }

    const LOCALES = {
      it: {
        polish: "Perfeziona",
        polishing: "Perfezionamento…",
        cancel: "Annulla",
        cancelTooltip: "Interrompi la richiesta AI",
        undo: "Ripristina",
        undoTooltip: "Ripristina la bozza originale",
        tooltip: "Perfeziona la bozza corrente con l'AI",
        styleTooltip: "Seleziona stile di riscrittura",
        truncated: "Risultato parzialmente troncato (limite token)",
        failed: "Perfezionamento fallito",
        previewTitle: "✨ Confronto Perfezionamento Prompt",
        original: "Bozza Originale",
        polished: "Proposta Ottimizzata AI",
        accept: "Accetta nel box",
        reject: "Rifiuta",
        copy: "Copia",
        copied: "Copiato!",
        context: "Contesto",
        contextTooltip: "Includi cartella di lavoro, task attivi e obiettivo di sessione per arricchire il prompt",
        streaming: "Generazione in corso…",
        completed: "Completato",
        styles: {
          balanced: "Bilanciato",
          concise: "Conciso",
          detailed: "Dettagliato",
          code: "Codice",
        },
      },
      en: {
        polish: "Polish",
        polishing: "Polishing…",
        cancel: "Cancel",
        cancelTooltip: "Abort in-flight polish request",
        undo: "Undo",
        undoTooltip: "Restore original draft",
        tooltip: "Polish current draft with AI",
        styleTooltip: "Select rewrite style",
        truncated: "Result partially truncated (token budget reached)",
        failed: "Polish failed",
        previewTitle: "✨ Prompt Polish Diff & Review",
        original: "Original Draft",
        polished: "AI Polished Prompt",
        accept: "Accept into composer",
        reject: "Discard",
        copy: "Copy",
        copied: "Copied!",
        context: "Context",
        contextTooltip: "Include workspace folder, active tasks, and session goal to enrich prompt details",
        streaming: "Streaming response…",
        completed: "Complete",
        styles: {
          balanced: "Balanced",
          concise: "Concise",
          detailed: "Detailed",
          code: "Code",
        },
      },
      zh: {
        polish: "润色",
        polishing: "润色中…",
        cancel: "取消",
        cancelTooltip: "取消当前润色请求",
        undo: "撤销",
        undoTooltip: "恢复原草稿",
        tooltip: "用 AI 润色当前输入为专业提示词",
        styleTooltip: "选择润色风格",
        truncated: "润色结果较长，已写入（部分截断）",
        failed: "润色失败",
        previewTitle: "✨ 提示词润色对比",
        original: "原始草稿",
        polished: "AI 优化提示词",
        accept: "采纳并填入",
        reject: "放弃",
        copy: "复制",
        copied: "已复制！",
        context: "会话上下文",
        contextTooltip: "附带工作区路径、活跃任务与当前目标以强化提示词细节",
        streaming: "正在流式生成…",
        completed: "完成",
        styles: {
          balanced: "平衡",
          concise: "简洁",
          detailed: "详细",
          code: "代码",
        },
      },
    };

    function detectLang() {
      if (typeof navigator === "undefined" || !navigator.language) return "en";
      const nav = navigator.language.toLowerCase();
      if (nav.startsWith("it")) return "it";
      if (nav.startsWith("zh")) return "zh";
      return "en";
    }

    function PromptPolishControl({
      useInput,
      inputActions,
      sessionId,
      useSessions,
      useProjection,
    }) {
      const draft = useInput ? useInput((state) => state.draft) : "";
      const [busy, setBusy] = React.useState(false);
      const [error, setError] = React.useState(null);
      const [originalDraft, setOriginalDraft] = React.useState(null);

      const [style, setStyle] = React.useState(() => {
        try {
          const saved = localStorage.getItem(STORAGE_STYLE_KEY);
          if (saved === "concise" || saved === "detailed" || saved === "code" || saved === "balanced") {
            return saved;
          }
        } catch {}
        return "balanced";
      });

      const [withContext, setWithContext] = React.useState(() => {
        try {
          return localStorage.getItem(STORAGE_CONTEXT_KEY) !== "false";
        } catch {
          return true;
        }
      });

      const [previewOpen, setPreviewOpen] = React.useState(false);
      const [previewOriginal, setPreviewOriginal] = React.useState("");
      const [previewPolished, setPreviewPolished] = React.useState("");
      const [previewStatus, setPreviewStatus] = React.useState("streaming");
      const [copied, setCopied] = React.useState(false);

      const abortControllerRef = React.useRef(null);
      const aliveRef = React.useRef(true);
      const lang = detectLang();
      const loc = LOCALES[lang] || LOCALES.en;

      // Extract session context when available
      const cwd = useSessions
        ? useSessions((s) => (sessionId ? s.byId && s.byId[sessionId] && s.byId[sessionId].cwd : undefined))
        : undefined;
      const goalObj = useProjection ? useProjection("goal") : undefined;
      const todosList = useProjection ? useProjection("todos") : undefined;

      React.useEffect(() => {
        aliveRef.current = true;
        return () => {
          aliveRef.current = false;
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
        };
      }, []);

      React.useEffect(() => {
        if (error === null) return;
        const timer = setTimeout(() => {
          if (aliveRef.current) setError(null);
        }, 6000);
        return () => clearTimeout(timer);
      }, [error]);

      const text = (draft ?? "").trim();
      const disabled = busy || inputActions === undefined || text.length === 0;

      const handleStyleChange = (e) => {
        const val = e.target.value;
        setStyle(val);
        try {
          localStorage.setItem(STORAGE_STYLE_KEY, val);
        } catch {}
      };

      const toggleContext = () => {
        setWithContext((prev) => {
          const next = !prev;
          try {
            localStorage.setItem(STORAGE_CONTEXT_KEY, String(next));
          } catch {}
          return next;
        });
      };

      const onCancel = React.useCallback(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        if (aliveRef.current) {
          setBusy(false);
          setPreviewStatus("completed");
        }
      }, []);

      const onPolish = React.useCallback(async () => {
        if (busy) {
          onCancel();
          return;
        }

        if (inputActions === undefined || text.length === 0) return;

        setBusy(true);
        setError(null);
        setPreviewOriginal(text);
        setPreviewPolished("");
        setPreviewStatus("streaming");
        setPreviewOpen(true);
        setCopied(false);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const contextData = withContext
          ? {
              cwd: cwd || undefined,
              goal: goalObj && goalObj.objective ? goalObj.objective : undefined,
              todos: Array.isArray(todosList) ? todosList.map((t) => t.content).filter(Boolean) : undefined,
            }
          : undefined;

        try {
          const resp = await fetch("/dsh-prompt-polish/polish", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              accept: "text/event-stream",
            },
            body: JSON.stringify({
              text,
              style,
              sessionId,
              stream: true,
              context: contextData,
            }),
            signal: controller.signal,
          });

          if (!resp.ok) {
            const errJson = await resp.json().catch(() => ({}));
            throw new Error(errJson.error || `${loc.failed} (${resp.status})`);
          }

          if (!resp.body) {
            throw new Error("No readable response body");
          }

          const reader = resp.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let accumulated = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const raw = trimmed.slice(5).trim();
              if (!raw) continue;

              try {
                const ev = JSON.parse(raw);

                if (ev.type === "delta" && typeof ev.delta === "string") {
                  accumulated += ev.delta;
                  if (aliveRef.current) {
                    setPreviewPolished(accumulated);
                  }
                } else if (ev.type === "done") {
                  if (typeof ev.text === "string" && ev.text.length > 0) {
                    accumulated = ev.text;
                  }
                  if (aliveRef.current) {
                    setPreviewPolished(accumulated);
                    setPreviewStatus("completed");
                    if (ev.truncated) setError(loc.truncated);
                  }
                } else if (ev.type === "error") {
                  throw new Error(ev.error || loc.failed);
                }
              } catch (parseErr) {}
            }
          }

          if (aliveRef.current) {
            setPreviewStatus("completed");
          }
        } catch (e) {
          if (e && e.name === "AbortError") {
            // Aborted
          } else {
            const msg = e instanceof Error ? e.message : String(e);
            setError(msg);
            if (aliveRef.current) setPreviewStatus("error");
          }
        } finally {
          if (aliveRef.current) {
            setBusy(false);
            abortControllerRef.current = null;
          }
        }
      }, [busy, inputActions, text, style, sessionId, withContext, cwd, goalObj, todosList, loc, onCancel]);

      const onAccept = () => {
        if (inputActions && previewPolished.trim().length > 0) {
          setOriginalDraft(previewOriginal);
          inputActions.setDraft(previewPolished.trim());
          setPreviewOpen(false);
        }
      };

      const onDiscard = () => {
        if (busy) onCancel();
        setPreviewOpen(false);
      };

      const onCopy = async () => {
        if (!previewPolished) return;
        try {
          await navigator.clipboard.writeText(previewPolished);
          setCopied(true);
          setTimeout(() => {
            if (aliveRef.current) setCopied(false);
          }, 2500);
        } catch {}
      };

      const onUndo = React.useCallback(() => {
        if (originalDraft !== null && inputActions !== undefined) {
          inputActions.setDraft(originalDraft);
          setOriginalDraft(null);
          setError(null);
        }
      }, [originalDraft, inputActions]);

      return h(
        "div",
        { className: "pp-group" },
        // Context-aware pill toggle
        h(
          "button",
          {
            type: "button",
            className: `pp-btn pp-btn-toggle ${withContext ? "pp-btn-toggle-active" : ""}`,
            onClick: toggleContext,
            title: loc.contextTooltip,
            "aria-label": loc.context,
          },
          h("span", { className: "pp-icon", "aria-hidden": "true" }, "🧠"),
          h("span", null, loc.context)
        ),
        // Style selector
        h(
          "select",
          {
            className: "pp-select",
            value: style,
            onChange: handleStyleChange,
            disabled: busy,
            title: loc.styleTooltip,
            "aria-label": "Style",
          },
          h("option", { value: "balanced" }, loc.styles.balanced),
          h("option", { value: "concise" }, loc.styles.concise),
          h("option", { value: "detailed" }, loc.styles.detailed),
          h("option", { value: "code" }, loc.styles.code)
        ),
        // Polish / Cancel Button
        h(
          "button",
          {
            type: "button",
            className: `pp-btn ${busy ? "pp-btn-busy" : ""}`,
            disabled: disabled && !busy,
            onClick: () => {
              void onPolish();
            },
            title: busy ? loc.cancelTooltip : loc.tooltip,
            "aria-label": busy ? loc.cancel : loc.polish,
          },
          busy
            ? h("span", { className: "pp-spin", "aria-hidden": "true" })
            : h("span", { className: "pp-icon", "aria-hidden": "true" }, "✨"),
          h("span", { className: "pp-text" }, busy ? ` ${loc.cancel}` : ` ${loc.polish}`)
        ),
        // Undo button
        originalDraft !== null && !busy
          ? h(
              "button",
              {
                type: "button",
                className: "pp-btn pp-btn-undo",
                onClick: onUndo,
                title: loc.undoTooltip,
                "aria-label": loc.undo,
              },
              h("span", { className: "pp-icon", "aria-hidden": "true" }, "↩️"),
              h("span", { className: "pp-text" }, ` ${loc.undo}`)
            )
          : null,
        // Error notice
        error !== null
          ? h("span", { className: "pp-err", role: "status", title: error }, error)
          : null,
        // Modal Diff & Review
        previewOpen
          ? h(
              "div",
              { className: "pp-modal-backdrop", onClick: onDiscard },
              h(
                "div",
                {
                  className: "pp-modal",
                  onClick: (e) => e.stopPropagation(),
                },
                // Modal Header
                h(
                  "div",
                  { className: "pp-modal-head" },
                  h("span", null, loc.previewTitle),
                  h(
                    "button",
                    {
                      type: "button",
                      className: "pp-modal-close",
                      onClick: onDiscard,
                      title: loc.reject,
                    },
                    "✕"
                  )
                ),
                // Modal Body: Side-by-side
                h(
                  "div",
                  { className: "pp-modal-body" },
                  // Left Pane: Original
                  h(
                    "div",
                    { className: "pp-pane" },
                    h("div", { className: "pp-pane-head" }, h("span", null, loc.original)),
                    h("div", { className: "pp-pane-content" }, previewOriginal)
                  ),
                  // Right Pane: AI Polished
                  h(
                    "div",
                    { className: "pp-pane" },
                    h(
                      "div",
                      { className: "pp-pane-head" },
                      h("span", null, loc.polished),
                      previewStatus === "streaming"
                        ? h("span", { className: "pp-spin", "aria-hidden": "true", style: { width: 10, height: 10 } })
                        : null
                    ),
                    h("div", { className: "pp-pane-content" }, previewPolished || (previewStatus === "streaming" ? "…" : ""))
                  )
                ),
                // Modal Footer
                h(
                  "div",
                  { className: "pp-modal-foot" },
                  h(
                    "div",
                    { className: "pp-foot-status" },
                    previewStatus === "streaming"
                      ? h(React.Fragment, null, [
                          h("span", { className: "pp-spin", "aria-hidden": "true", key: "spin" }),
                          h("span", { key: "text" }, loc.streaming),
                        ])
                      : h("span", null, `${withContext ? "🧠 Context-Aware · " : ""}${loc.completed}`)
                  ),
                  h(
                    "div",
                    { className: "pp-foot-actions" },
                    h(
                      "button",
                      {
                        type: "button",
                        className: "pp-action-btn",
                        onClick: onCopy,
                        disabled: !previewPolished,
                      },
                      copied ? loc.copied : loc.copy
                    ),
                    h(
                      "button",
                      {
                        type: "button",
                        className: "pp-action-btn",
                        onClick: onDiscard,
                      },
                      loc.reject
                    ),
                    h(
                      "button",
                      {
                        type: "button",
                        className: "pp-action-btn pp-action-btn-primary",
                        onClick: onAccept,
                        disabled: !previewPolished,
                      },
                      loc.accept
                    )
                  )
                )
              )
            )
          : null
      );
    }

    const name = PLUGIN;
    const inject = ["slots"];

    function apply(ctx) {
      ensureStyle();
      ctx.slots.inject("conversation.input.right", () =>
        ctx.slots.register(
          {
            id: PLUGIN,
            name: "conversation.input.right",
            order: 500,
            label: () => "Prompt Polish",
          },
          (props) => h(PromptPolishControl, props)
        )
      );
    }

    return {
      name,
      inject,
      apply,
    };
  },
});
