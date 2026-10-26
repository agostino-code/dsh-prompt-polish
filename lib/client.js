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
  gap: 5px;
  position: relative;
  font-family: inherit;
  font-size: 13px;
  line-height: 20px;
}

/* DSH native-style rounded pill button */
#dsh-prompt-polish-style .pp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 28px;
  padding: 0 10px;
  border-radius: 9999px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.24));
  background: transparent;
  color: var(--dsw-alias-label-secondary, #9ca3af);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

#dsh-prompt-polish-style .pp-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
  border-color: var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.38));
  color: var(--dsw-alias-label-primary, #ffffff);
}

#dsh-prompt-polish-style .pp-btn:focus-visible {
  box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, #4a7cff);
}

#dsh-prompt-polish-style .pp-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.15));
}

/* Context pill button with state indicator */
#dsh-prompt-polish-style .pp-btn-context {
  padding: 0 10px;
}

#dsh-prompt-polish-style .pp-btn-context-active {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
  border-color: var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.38));
  color: var(--dsw-alias-label-primary, #ffffff);
}

#dsh-prompt-polish-style .pp-btn-context-inactive {
  opacity: 0.65;
  border-style: dashed;
}

#dsh-prompt-polish-style .pp-context-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  flex: none;
}

#dsh-prompt-polish-style .pp-context-dot-off {
  background: var(--dsw-alias-label-tertiary, #6b7280);
}

/* Polishing in-flight button */
#dsh-prompt-polish-style .pp-btn-busy {
  border-color: #f59e0b;
  color: var(--dsw-alias-label-primary, #ffffff);
}

#dsh-prompt-polish-style .pp-btn-busy:hover {
  background: rgba(239, 68, 68, 0.15) !important;
  border-color: #ef4444 !important;
  color: #ef4444 !important;
}

/* Undo button */
#dsh-prompt-polish-style .pp-btn-undo {
  padding: 0 9px;
  border-color: var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.28));
}

#dsh-prompt-polish-style .pp-btn-undo:hover {
  border-color: #10b981;
  color: #10b981;
}

/* Rounded select */
#dsh-prompt-polish-style .pp-select {
  height: 28px;
  padding: 0 8px;
  border-radius: 9999px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.24));
  background: transparent;
  color: var(--dsw-alias-label-secondary, #9ca3af);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.15s ease;
}

#dsh-prompt-polish-style .pp-select:hover {
  border-color: var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.38));
  color: var(--dsw-alias-label-primary, #ffffff);
}

#dsh-prompt-polish-style .pp-select option {
  background: var(--dsw-alias-bg-surface-l1, #1e1e1e);
  color: var(--dsw-alias-label-primary, #ffffff);
}

/* Elegant gray monochrome icons */
#dsh-prompt-polish-style .pp-icon-svg {
  width: 14px;
  height: 14px;
  flex: none;
  display: inline-block;
  fill: currentColor;
  opacity: 0.85;
  transition: opacity 0.15s ease;
}

#dsh-prompt-polish-style .pp-btn:hover .pp-icon-svg {
  opacity: 1;
}

#dsh-prompt-polish-style .pp-spin {
  width: 12px;
  height: 12px;
  border: 2px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.4));
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: ppSpin 0.7s linear infinite;
  display: inline-block;
  flex: none;
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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ppFadeIn 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

#dsh-prompt-polish-style .pp-modal {
  background: var(--dsw-alias-bg-surface-l1, #1e1e1e);
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.25));
  border-radius: var(--dsw-radius-md, 12px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5);
  color: var(--dsw-alias-label-primary, #e0e0e0);
  width: min(920px, 95vw);
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ppScaleUp 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

#dsh-prompt-polish-style .pp-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.16));
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
  padding: 4px 8px;
  border-radius: 9999px;
  transition: all 0.15s ease;
}

#dsh-prompt-polish-style .pp-modal-close:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.15));
  color: var(--dsw-alias-label-primary, #fff);
}

#dsh-prompt-polish-style .pp-modal-body {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 16px;
  padding: 16px 18px;
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
  background: var(--dsw-alias-bg-surface-l2, rgba(0, 0, 0, 0.25));
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.2));
  border-radius: var(--dsw-radius-sm, 8px);
  overflow: hidden;
}

#dsh-prompt-polish-style .pp-pane-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--dsw-alias-bg-surface-l3, rgba(255, 255, 255, 0.04));
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.15));
  color: var(--dsw-alias-label-secondary, #aaa);
}

#dsh-prompt-polish-style .pp-pane-content {
  padding: 12px 14px;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.55;
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
  padding: 12px 18px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.16));
  background: var(--dsw-alias-bg-surface-l2, rgba(0, 0, 0, 0.15));
  gap: 12px;
}

#dsh-prompt-polish-style .pp-foot-status {
  display: flex;
  align-items: center;
  gap: 8px;
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
  padding: 0 14px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 9999px;
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
        cancelTooltip: "Interrompi la generazione in corso",
        undo: "Ripristina",
        undoTooltip: "Ripristina la bozza originale",
        tooltip: "Perfeziona il prompt corrente con l'AI",
        styleTooltip: "Seleziona lo stile di riscrittura",
        truncated: "Risultato parzialmente troncato (limite token)",
        failed: "Perfezionamento fallito",
        previewTitle: "Revisione e Confronto Prompt",
        original: "Bozza Originale",
        polished: "Bozza Perfezionata",
        accept: "Applica nel box",
        reject: "Annulla",
        copy: "Copia",
        copied: "Copiato!",
        context: "Contesto",
        contextActive: "Attivo",
        contextInactive: "Disattivo",
        contextTooltipActive: "Contesto di sessione ATTIVO (include cartella workspace, goal e task)",
        contextTooltipInactive: "Contesto di sessione DISATTIVO (clicca per attivare)",
        contextSummary: "Contesto rilevato",
        streaming: "Generazione in tempo reale…",
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
        cancelTooltip: "Abort ongoing generation",
        undo: "Undo",
        undoTooltip: "Restore original draft",
        tooltip: "Polish current draft with AI",
        styleTooltip: "Select rewrite style",
        truncated: "Result partially truncated (token budget reached)",
        failed: "Polish failed",
        previewTitle: "Prompt Review & Diff",
        original: "Original Draft",
        polished: "Polished Draft",
        accept: "Apply to composer",
        reject: "Discard",
        copy: "Copy",
        copied: "Copied!",
        context: "Context",
        contextActive: "Active",
        contextInactive: "Inactive",
        contextTooltipActive: "Session context ACTIVE (includes workspace path, goal, and tasks)",
        contextTooltipInactive: "Session context INACTIVE (click to enable)",
        contextSummary: "Context detected",
        streaming: "Streaming response…",
        completed: "Completed",
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
        cancelTooltip: "中止生成",
        undo: "撤销",
        undoTooltip: "恢复原草稿",
        tooltip: "用 AI 优化提示词",
        styleTooltip: "选择润色风格",
        truncated: "结果较长（已截断）",
        failed: "润色失败",
        previewTitle: "提示词对比与审查",
        original: "原始输入",
        polished: "优化结果",
        accept: "填入输入框",
        reject: "放弃",
        copy: "复制",
        copied: "已复制！",
        context: "上下文",
        contextActive: "已开启",
        contextInactive: "已关闭",
        contextTooltipActive: "会话上下文已启用（附带工作区、目标与任务）",
        contextTooltipInactive: "会话上下文已关闭（点击开启）",
        contextSummary: "已检测上下文",
        streaming: "正在流式生成…",
        completed: "已完成",
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

    // Elegant monochrome SVG icons in shades of gray
    function IconBrain() {
      return h(
        "svg",
        { viewBox: "0 0 24 24", className: "pp-icon-svg", "aria-hidden": "true" },
        h("path", {
          d: "M12 3c-2.4 0-4.4 1.7-4.9 4A4.5 4.5 0 0 0 3 11.5c0 1.4.6 2.6 1.6 3.4A4.5 4.5 0 0 0 8 19.5c.3 0 .7 0 1-.1V21h6v-1.6c.3.1.7.1 1 .1a4.5 4.5 0 0 0 3.4-4.6c1-.8 1.6-2 1.6-3.4a4.5 4.5 0 0 0-4.1-4.5C16.4 4.7 14.4 3 12 3zm-1 2c1.7 0 3.1 1.2 3.4 2.8l.2.8.8.1c1.4.2 2.5 1.4 2.5 2.8 0 .4-.1.8-.3 1.2l-.4.8.7.6c.7.6 1.1 1.5 1.1 2.4 0 1.9-1.5 3.4-3.4 3.4-.4 0-.8-.1-1.1-.2l-.8-.3-.5.7c-.5.8-1.4 1.3-2.3 1.3V19h-2v2.4c-.9 0-1.8-.5-2.3-1.3l-.5-.7-.8.3c-.3.1-.7.2-1.1.2-1.9 0-3.4-1.5-3.4-3.4 0-.9.4-1.8 1.1-2.4l.7-.6-.4-.8c-.2-.4-.3-.8-.3-1.2 0-1.4 1.1-2.6 2.5-2.8l.8-.1.2-.8C7.9 6.2 9.3 5 11 5z",
        })
      );
    }

    function IconSparkle() {
      return h(
        "svg",
        { viewBox: "0 0 24 24", className: "pp-icon-svg", "aria-hidden": "true" },
        h("path", {
          d: "M12 2.5c.3 3.6 2.6 6.5 6.2 7.1.4.1.4.7 0 .8-3.6.6-5.9 3.5-6.2 7.1 0 .4-.6.4-.7 0-.3-3.6-2.6-6.5-6.2-7.1-.4-.1-.4-.7 0-.8 3.6-.6 5.9-3.5 6.2-7.1.1-.4.7-.4.7 0zm6.5 11.5c.2 1.8 1.3 3.2 3.1 3.5.2 0 .2.4 0 .4-1.8.3-2.9 1.7-3.1 3.5 0 .2-.3.2-.4 0-.2-1.8-1.3-3.2-3.1-3.5-.2 0-.2-.4 0-.4 1.8-.3 2.9-1.7 3.1-3.5.1-.2.3-.2.4 0z",
        })
      );
    }

    function IconUndo() {
      return h(
        "svg",
        { viewBox: "0 0 24 24", className: "pp-icon-svg", "aria-hidden": "true" },
        h("path", {
          d: "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z",
        })
      );
    }

    function PromptPolishControl(props) {
      const {
        useInput,
        inputActions,
        sessionId,
        useWorkspaces,
        useSessions,
        useProjection,
      } = props;

      const draft = useInput((state) => state.draft);
      const [busy, setBusy] = React.useState(false);
      const [error, setError] = React.useState(null);
      const [originalDraft, setOriginalDraft] = React.useState(null);

      const [style, setStyle] = React.useState(() => {
        try {
          const saved = localStorage.getItem(STORAGE_STYLE_KEY);
          if (
            saved === "concise" ||
            saved === "detailed" ||
            saved === "code" ||
            saved === "balanced"
          ) {
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

      // Extract session context reliably from workspaces or sessions snapshot
      const workspacesList = useWorkspaces
        ? useWorkspaces((s) => s.items)
        : undefined;
      const matchedWorkspace =
        (workspacesList &&
          workspacesList.find(
            (w) => sessionId && w.sessionIds && w.sessionIds.includes(sessionId)
          )) ||
        (workspacesList && workspacesList[0]);
      const resolvedCwd = matchedWorkspace ? (matchedWorkspace.path || matchedWorkspace.title) : undefined;

      const sessionCwd = useSessions
        ? useSessions((s) => (sessionId && s.byId && s.byId[sessionId] ? s.byId[sessionId].cwd : undefined))
        : undefined;
      const activeCwd = resolvedCwd || sessionCwd;

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
              cwd: activeCwd || undefined,
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
      }, [busy, inputActions, text, style, sessionId, withContext, activeCwd, goalObj, todosList, loc, onCancel]);

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
        // Elegant rounded pill: Context Toggle
        h(
          "button",
          {
            type: "button",
            className: `pp-btn pp-btn-context ${
              withContext ? "pp-btn-context-active" : "pp-btn-context-inactive"
            }`,
            onClick: toggleContext,
            title: withContext ? loc.contextTooltipActive : loc.contextTooltipInactive,
            "aria-label": loc.context,
            "aria-pressed": withContext,
          },
          h(IconBrain),
          h("span", null, loc.context),
          h("span", {
            className: `pp-context-dot ${withContext ? "" : "pp-context-dot-off"}`,
            "aria-hidden": "true",
          })
        ),
        // Elegant rounded pill: Style selector
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
        // Elegant rounded pill: Polish / Cancel action
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
          busy ? h("span", { className: "pp-spin", "aria-hidden": "true" }) : h(IconSparkle),
          h("span", { className: "pp-text" }, busy ? loc.cancel : loc.polish)
        ),
        // Elegant rounded pill: Undo button
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
              h(IconUndo),
              h("span", { className: "pp-text" }, loc.undo)
            )
          : null,
        // Error notice
        error !== null
          ? h("span", { className: "pp-err", role: "status", title: error }, error)
          : null,
        // Modal Preview Diff
        previewOpen
          ? h(
              "div",
              { className: "pp-modal-backdrop", onClick: onDiscard },
              h(
                "div",
                { className: "pp-modal", onClick: (e) => e.stopPropagation() },
                // Modal Head
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
                // Modal Body
                h(
                  "div",
                  { className: "pp-modal-body" },
                  h(
                    "div",
                    { className: "pp-pane" },
                    h(
                      "div",
                      { className: "pp-pane-head" },
                      h("span", null, loc.original)
                    ),
                    h("div", { className: "pp-pane-content" }, previewOriginal)
                  ),
                  h(
                    "div",
                    { className: "pp-pane" },
                    h(
                      "div",
                      { className: "pp-pane-head" },
                      h("span", null, loc.polished),
                      previewStatus === "streaming"
                        ? h("span", {
                            className: "pp-spin",
                            "aria-hidden": "true",
                            style: { width: 10, height: 10 },
                          })
                        : null
                    ),
                    h(
                      "div",
                      { className: "pp-pane-content" },
                      previewPolished || (previewStatus === "streaming" ? "…" : "")
                    )
                  )
                ),
                // Modal Foot
                h(
                  "div",
                  { className: "pp-modal-foot" },
                  h(
                    "div",
                    { className: "pp-foot-status" },
                    previewStatus === "streaming"
                      ? h(React.Fragment, null, [
                          h("span", {
                            className: "pp-spin",
                            "aria-hidden": "true",
                            key: "s",
                          }),
                          h("span", { key: "t" }, loc.streaming),
                        ])
                      : h(
                          "span",
                          null,
                          `${withContext ? "🧠 Context-Aware · " : ""}${loc.completed}`
                        )
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
