window.__ModuleLoader__.load({
  id: "dsh-prompt-polish",
  factory: (require) => {
    const React = require("react");
    const ReactDOM = require("react-dom");
    const h = React.createElement;
    const createPortal = ReactDOM.createPortal;

    const PLUGIN = "dsh-prompt-polish";
    const STYLE_ID = "dsh-prompt-polish-style";
    const STORAGE_STYLE_KEY = "dsh_prompt_polish_style";
    const STORAGE_CONTEXT_KEY = "dsh_prompt_polish_context";

    const CSS = `
/* DSH Prompt Polish Toolbar Controls */
.pp-group {
  display: inline-flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 4px !important;
  position: relative !important;
  font-family: inherit !important;
  font-size: 13px !important;
  line-height: 20px !important;
  height: 28px !important;
}

/* DSH native-conforming ghost button style */
.pp-btn {
  display: inline-flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 5px !important;
  height: 28px !important;
  padding: 0 8px !important;
  border-radius: var(--dsw-radius-sm, 6px) !important;
  border: 1px solid transparent !important;
  background: transparent !important;
  color: var(--dsw-alias-label-secondary, #9ca3af) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  line-height: 20px !important;
  cursor: pointer !important;
  white-space: nowrap !important;
  outline: none !important;
  transition: all 0.15s ease !important;
  user-select: none !important;
}

.pp-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.08)) !important;
  color: var(--dsw-alias-label-primary, #ffffff) !important;
}

.pp-btn:focus-visible {
  box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary, #4a7cff)) !important;
}

.pp-btn:disabled {
  color: var(--dsw-alias-label-dimmed, rgba(156, 163, 175, 0.4)) !important;
  cursor: default !important;
  opacity: 0.4 !important;
}

/* Context toggle state indicator */
.pp-btn-context-active {
  color: var(--dsw-alias-label-primary, #ffffff) !important;
  border-color: var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.12)) !important;
  background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.05)) !important;
}

.pp-btn-context-inactive {
  color: var(--dsw-alias-label-tertiary, #6b7280) !important;
  opacity: 0.7 !important;
}

.pp-context-dot {
  width: 5px !important;
  height: 5px !important;
  border-radius: 50% !important;
  background: #10b981 !important;
  display: inline-block !important;
  flex: none !important;
}

.pp-context-dot-off {
  background: var(--dsw-alias-label-caption, #4b5563) !important;
}

/* Polishing in-flight state */
.pp-btn-busy {
  color: #f59e0b !important;
  border-color: rgba(245, 158, 11, 0.3) !important;
}

.pp-btn-busy:hover {
  background: var(--dsw-alias-interactive-bg-hover-danger, rgba(239, 68, 68, 0.15)) !important;
  border-color: #ef4444 !important;
  color: #ef4444 !important;
}

/* Style select trigger wrapper matching DSH dropdowns */
.pp-select-wrapper {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  height: 28px !important;
}

.pp-select {
  height: 28px !important;
  padding: 0 20px 0 8px !important;
  border-radius: var(--dsw-radius-sm, 6px) !important;
  border: 1px solid transparent !important;
  background: transparent !important;
  color: var(--dsw-alias-label-secondary, #9ca3af) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  line-height: 20px !important;
  cursor: pointer !important;
  outline: none !important;
  appearance: none !important;
  -webkit-appearance: none !important;
  transition: all 0.15s ease !important;
}

.pp-select:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.08)) !important;
  color: var(--dsw-alias-label-primary, #ffffff) !important;
}

.pp-select-chevron {
  position: absolute !important;
  right: 6px !important;
  pointer-events: none !important;
  color: var(--dsw-alias-label-caption, #6b7280) !important;
  display: inline-flex !important;
  align-items: center !important;
}

.pp-select option {
  background: var(--dsw-alias-bg-surface-l1, #1e1e1e) !important;
  color: var(--dsw-alias-label-primary, #ffffff) !important;
}

/* DSH native-conforming 16px monochrome SVG icons */
.pp-icon-svg {
  width: 15px !important;
  height: 15px !important;
  flex: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: inherit !important;
}

.pp-spin {
  width: 13px !important;
  height: 13px !important;
  border: 2px solid rgba(156, 163, 175, 0.25) !important;
  border-top-color: #f59e0b !important;
  border-radius: 50% !important;
  animation: ppSpin 0.7s linear infinite !important;
  display: inline-block !important;
  flex: none !important;
}

.pp-err {
  font-size: 11px !important;
  color: var(--dsw-alias-state-error-primary, #e5484d) !important;
  max-width: 180px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  margin-left: 4px !important;
}

/* Modal Diff & Review Overlay: Body Portal, fixed at z-index 10000 */
.pp-modal-backdrop {
  position: fixed !important;
  inset: 0 !important;
  z-index: 10000 !important;
  background: var(--dsw-alias-bg-mask-1, rgba(0, 0, 0, 0.65)) !important;
  backdrop-filter: var(--dsw-mask-blur, blur(4px)) !important;
  -webkit-backdrop-filter: var(--dsw-mask-blur, blur(4px)) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 24px !important;
  animation: ppFadeIn 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.pp-modal {
  box-sizing: border-box !important;
  background: var(--dsw-alias-bg-layer-2, #1e1e1e) !important;
  border: 1px solid var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.25)) !important;
  border-radius: var(--dsw-radius-panel, 12px) !important;
  box-shadow: var(--dsw-elevation-prominent, 0 20px 48px rgba(0, 0, 0, 0.5)) !important;
  color: var(--dsw-alias-label-primary, #e0e0e0) !important;
  width: min(880px, 92vw) !important;
  max-height: 85vh !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  animation: ppScaleUp 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.pp-modal-head {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 16px 20px !important;
  border-bottom: 1px solid var(--dsw-alias-border-l3, rgba(128, 128, 128, 0.16)) !important;
  font-size: 15px !important;
  font-weight: 600 !important;
}

.pp-modal-close {
  background: transparent !important;
  border: none !important;
  font-size: 16px !important;
  line-height: 1 !important;
  color: var(--dsw-alias-label-tertiary, #888) !important;
  cursor: pointer !important;
  padding: 4px 8px !important;
  border-radius: var(--dsw-radius-sm, 6px) !important;
  transition: all 0.15s ease !important;
}

.pp-modal-close:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.15)) !important;
  color: var(--dsw-alias-label-primary, #fff) !important;
}

.pp-modal-body {
  display: grid !important;
  grid-template-columns: 1fr 1.25fr !important;
  gap: 16px !important;
  padding: 18px 20px !important;
  overflow-y: auto !important;
  flex: 1 !important;
  min-height: 260px !important;
  max-height: calc(85vh - 130px) !important;
}

@media (max-width: 680px) {
  .pp-modal-body {
    grid-template-columns: 1fr !important;
  }
}

.pp-pane {
  display: flex !important;
  flex-direction: column !important;
  background: var(--dsw-alias-bg-surface-l2, rgba(0, 0, 0, 0.25)) !important;
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.18)) !important;
  border-radius: var(--dsw-radius-md, 8px) !important;
  overflow: hidden !important;
}

.pp-pane-head {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 8px 12px !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  background: var(--dsw-alias-bg-surface-l3, rgba(255, 255, 255, 0.04)) !important;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.15)) !important;
  color: var(--dsw-alias-label-secondary, #aaa) !important;
}

.pp-pane-content {
  padding: 14px 16px !important;
  font-family: inherit !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
  white-space: pre-wrap !important;
  word-break: break-word !important;
  overflow-y: auto !important;
  flex: 1 !important;
  user-select: text !important;
}

.pp-modal-foot {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 14px 20px !important;
  border-top: 1px solid var(--dsw-alias-border-l3, rgba(128, 128, 128, 0.16)) !important;
  background: var(--dsw-alias-bg-surface-l2, rgba(0, 0, 0, 0.15)) !important;
  gap: 12px !important;
}

.pp-foot-status {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 12px !important;
  color: var(--dsw-alias-label-secondary, #aaa) !important;
}

.pp-foot-actions {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.pp-action-btn {
  height: 30px !important;
  padding: 0 14px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  border-radius: var(--dsw-radius-sm, 6px) !important;
  cursor: pointer !important;
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.28)) !important;
  background: transparent !important;
  color: var(--dsw-alias-label-primary, inherit) !important;
  transition: all 0.15s ease !important;
}

.pp-action-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.15)) !important;
}

.pp-action-btn-primary {
  background: var(--dsw-alias-brand-primary, #2563eb) !important;
  border-color: var(--dsw-alias-brand-primary, #2563eb) !important;
  color: #ffffff !important;
}

.pp-action-btn-primary:hover {
  filter: brightness(1.1) !important;
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

    // Native DSH geometry: IconContextInjectionOutlineRegular
    function IconContextInjection() {
      return h(
        "svg",
        {
          viewBox: "0 0 16 16",
          className: "pp-icon-svg",
          fill: "none",
          "aria-hidden": "true",
          stroke: "currentColor",
          strokeWidth: "1",
        },
        h("path", { d: "M2.5 7.5L5.5 10.5L13.5 2.5" }),
        h("path", { d: "M5.5 5L8 7.5L10.5 5" }),
        h("path", { d: "M5.5 11H10.5" })
      );
    }

    // Native DSH geometry: IconEnhanceOutlineRegular
    function IconEnhance() {
      return h(
        "svg",
        {
          viewBox: "0 0 16 16",
          className: "pp-icon-svg",
          fill: "none",
          "aria-hidden": "true",
          stroke: "currentColor",
          strokeWidth: "1",
        },
        h("path", { d: "M1.98486 2.95374H14.0151" }),
        h("path", { d: "M1.98486 6.31787H14.0151" }),
        h("path", { d: "M1.98486 9.68213H14.0151" }),
        h("path", { d: "M1.98486 13.0463H8.4627" })
      );
    }

    // Native DSH geometry: IconListPenOutlineRegular
    function IconUndo() {
      return h(
        "svg",
        {
          viewBox: "0 0 16 16",
          className: "pp-icon-svg",
          fill: "none",
          "aria-hidden": "true",
          stroke: "currentColor",
          strokeWidth: "1",
        },
        h("path", { d: "M4.5 5.5H12.5" }),
        h("path", { d: "M4.5 8.5H10.5" }),
        h("path", { d: "M4.5 11.5H8.5" }),
        h("path", { d: "M2.5 5.5H2.51" }),
        h("path", { d: "M2.5 8.5H2.51" }),
        h("path", { d: "M2.5 11.5H2.51" })
      );
    }

    // Native DSH geometry: IconChevronDownOutlineRegular
    function IconChevronDown() {
      return h(
        "svg",
        {
          viewBox: "0 0 16 16",
          width: "11",
          height: "11",
          fill: "none",
          "aria-hidden": "true",
          stroke: "currentColor",
          strokeWidth: "1.2",
        },
        h("path", { d: "M3.5 6L8 10.5L12.5 6" })
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

      // Portaled Modal: mounted to document.body, avoiding any disturbance to the composer bar
      const modalPortal =
        previewOpen && typeof document !== "undefined" && typeof createPortal === "function"
          ? createPortal(
              h(
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
              ),
              document.body
            )
          : null;

      return h(
        React.Fragment,
        null,
        h(
          "div",
          { className: "pp-group" },
          // Native DSH trigger: Context Toggle
          h(
            "button",
            {
              type: "button",
              className: `pp-btn ${
                withContext ? "pp-btn-context-active" : "pp-btn-context-inactive"
              }`,
              onClick: toggleContext,
              title: withContext ? loc.contextTooltipActive : loc.contextTooltipInactive,
              "aria-label": loc.context,
              "aria-pressed": withContext,
            },
            h(IconContextInjection),
            h("span", null, loc.context),
            h("span", {
              className: `pp-context-dot ${withContext ? "" : "pp-context-dot-off"}`,
              "aria-hidden": "true",
            })
          ),
          // Native DSH trigger: Style dropdown with custom chevron
          h(
            "div",
            { className: "pp-select-wrapper" },
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
            h("span", { className: "pp-select-chevron", "aria-hidden": "true" }, h(IconChevronDown))
          ),
          // Native DSH trigger: Polish / Cancel action
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
            busy ? h("span", { className: "pp-spin", "aria-hidden": "true" }) : h(IconEnhance),
            h("span", null, busy ? loc.cancel : loc.polish)
          ),
          // Native DSH trigger: Undo button
          originalDraft !== null && !busy
            ? h(
                "button",
                {
                  type: "button",
                  className: "pp-btn",
                  onClick: onUndo,
                  title: loc.undoTooltip,
                  "aria-label": loc.undo,
                },
                h(IconUndo),
                h("span", null, loc.undo)
              )
            : null,
          // Error notice
          error !== null
            ? h("span", { className: "pp-err", role: "status", title: error }, error)
            : null
        ),
        // Modal Portal
        modalPortal
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
