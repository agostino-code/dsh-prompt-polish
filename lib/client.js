window.__ModuleLoader__.load({
  id: "dsh-prompt-polish",
  factory: (require) => {
    const React = require("react");
    const h = React.createElement;

    const PLUGIN = "dsh-prompt-polish";
    const STYLE_ID = "dsh-prompt-polish-style";
    const STORAGE_STYLE_KEY = "dsh_prompt_polish_style";

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
@keyframes ppSpin {
  to { transform: rotate(360deg); }
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

    function PromptPolishControl({ useInput, inputActions, sessionId }) {
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

      const abortControllerRef = React.useRef(null);
      const aliveRef = React.useRef(true);
      const lang = detectLang();
      const loc = LOCALES[lang] || LOCALES.en;

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
        }, 5000);
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

      const onCancel = React.useCallback(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        if (aliveRef.current) {
          setBusy(false);
          setError(null);
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

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
          const resp = await fetch("/dsh-prompt-polish/polish", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              text,
              style,
              sessionId,
            }),
            signal: controller.signal,
          });

          const data = await resp.json();

          if (resp.ok && data.ok === true && typeof data.text === "string" && data.text.length > 0) {
            setOriginalDraft(text);
            inputActions.setDraft(data.text);
            if (data.truncated) {
              setError(loc.truncated);
            }
          } else if (data.error) {
            setError(String(data.error));
          } else {
            setError(loc.failed);
          }
        } catch (e) {
          if (e && e.name === "AbortError") {
            // Aborted by user
          } else {
            setError(e instanceof Error ? e.message : String(e));
          }
        } finally {
          if (aliveRef.current) {
            setBusy(false);
            abortControllerRef.current = null;
          }
        }
      }, [busy, inputActions, text, style, sessionId, loc, onCancel]);

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
