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
    const STORAGE_OUTLANG_KEY = "dsh_prompt_polish_output_lang";
    const STORAGE_MODEL_KEY = "dsh_prompt_polish_model";
    const STORAGE_MAX_TOKENS_KEY = "dsh_prompt_polish_max_tokens";

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

/* Output language toggle state indicator */
.pp-btn-lang-active {
  color: var(--dsw-alias-label-primary, #ffffff) !important;
  border-color: rgba(59, 130, 246, 0.45) !important;
  background: rgba(59, 130, 246, 0.12) !important;
}

.pp-btn-lang-auto {
  color: var(--dsw-alias-label-tertiary, #6b7280) !important;
  opacity: 0.7 !important;
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
  flex-wrap: wrap !important;
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

/* DSH Plugin Settings Page View */
.pp-settings-container {
  display: flex !important;
  flex-direction: column !important;
  gap: 18px !important;
  padding: 4px !important;
  max-width: 680px !important;
  color: var(--dsw-alias-label-primary, #e0e0e0) !important;
  font-family: inherit !important;
}

.pp-settings-card {
  display: flex !important;
  flex-direction: column !important;
  gap: 18px !important;
  background: var(--dsw-alias-bg-layer-2, rgba(255, 255, 255, 0.03)) !important;
  border: 1px solid var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.2)) !important;
  border-radius: var(--dsw-radius-panel, 12px) !important;
  padding: 20px 24px !important;
}

.pp-settings-header {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  margin-bottom: 4px !important;
}

.pp-settings-title {
  font-size: 15px !important;
  font-weight: 600 !important;
  color: var(--dsw-alias-label-primary, #ffffff) !important;
}

.pp-settings-subtitle {
  font-size: 13px !important;
  color: var(--dsw-alias-label-secondary, #9ca3af) !important;
  line-height: 1.4 !important;
}

.pp-settings-field {
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
}

.pp-settings-label {
  font-size: 13px !important;
  font-weight: 500 !important;
  color: var(--dsw-alias-label-primary, #ffffff) !important;
}

.pp-settings-desc {
  font-size: 12px !important;
  color: var(--dsw-alias-label-tertiary, #888888) !important;
  line-height: 1.4 !important;
}

.pp-settings-input,
.pp-settings-select {
  height: 32px !important;
  padding: 0 10px !important;
  background: var(--dsw-alias-bg-surface-l1, rgba(0, 0, 0, 0.25)) !important;
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.28)) !important;
  border-radius: var(--dsw-radius-sm, 6px) !important;
  color: var(--dsw-alias-label-primary, #ffffff) !important;
  font-size: 13px !important;
  font-family: inherit !important;
  outline: none !important;
  transition: border-color 0.15s ease !important;
}

.pp-settings-input:focus,
.pp-settings-select:focus {
  border-color: var(--dsw-alias-state-business-primary, #4a7cff) !important;
}

.pp-settings-checkbox-row {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  cursor: pointer !important;
  user-select: none !important;
}

.pp-settings-checkbox {
  width: 16px !important;
  height: 16px !important;
  cursor: pointer !important;
  accent-color: #2563eb !important;
}

.pp-settings-footer {
  display: flex !important;
  align-items: center !important;
  gap: 14px !important;
  margin-top: 8px !important;
}

.pp-settings-save-btn {
  height: 32px !important;
  padding: 0 18px !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  border-radius: var(--dsw-radius-sm, 6px) !important;
  background: var(--dsw-alias-brand-primary, #2563eb) !important;
  color: #ffffff !important;
  border: none !important;
  cursor: pointer !important;
  transition: opacity 0.15s ease !important;
}

.pp-settings-save-btn:hover {
  opacity: 0.9 !important;
}

.pp-settings-msg {
  font-size: 12px !important;
  color: #10b981 !important;
  font-weight: 500 !important;
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
        contextTooltipActive: "Contesto di sessione ATTIVO (include workspace, panoramica progetto, ultimi prompt, goal e task)",
        contextTooltipInactive: "Contesto di sessione DISATTIVO (clicca per attivare)",
        contextSummary: "Contesto rilevato",
        outputLang: "Lingua Output",
        outputLangAuto: "Auto",
        outputLangEn: "EN",
        outputLangTooltipAuto: "Output nella lingua della bozza (clicca per forzare l'inglese)",
        outputLangTooltipEn: "Output forzato in INGLESE (clicca per tornare alla lingua della bozza)",
        streaming: "Generazione in tempo reale…",
        completed: "Completato",
        settingsTitle: "Impostazioni Prompt Polish",
        settingsDesc: "Configura il modello LLM e i parametri di riscrittura dei prompt per questo ambiente.",
        modelLabel: "Modello LLM per il Polish",
        modelAuto: "🤖 Automatico (Predefinito di DSH)",
        modelDesc: "Seleziona il modello da usare. In modalità Automatica, il plugin si adatterà automaticamente al modello attivo su qualsiasi computer o installazione.",
        defaultStyleLabel: "Stile di Riscrittura Predefinito",
        contextDefaultLabel: "Includi Contesto di Sessione",
        contextDefaultDesc: "Invia workspace, panoramica del progetto, ultimi prompt, obiettivi e compiti per arricchire il prompt.",
        maxTokensLabel: "Budget Massimo Token Risposta",
        saveSettings: "Salva Impostazioni",
        saved: "✓ Impostazioni salvate con successo!",
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
        contextTooltipActive: "Session context ACTIVE (includes workspace, project overview, recent prompts, goal, and tasks)",
        contextTooltipInactive: "Session context INACTIVE (click to enable)",
        contextSummary: "Context detected",
        outputLang: "Output Language",
        outputLangAuto: "Auto",
        outputLangEn: "EN",
        outputLangTooltipAuto: "Output in the draft language (click to force English)",
        outputLangTooltipEn: "Output forced to ENGLISH (click to return to the draft language)",
        streaming: "Streaming response…",
        completed: "Completed",
        settingsTitle: "Prompt Polish Settings",
        settingsDesc: "Configure the LLM model and prompt rewriting parameters for this environment.",
        modelLabel: "LLM Model for Polish",
        modelAuto: "🤖 Automatic (DSH Default Model)",
        modelDesc: "Select the model to use. In Automatic mode, the plugin adapts to whichever model is active on any computer.",
        defaultStyleLabel: "Default Rewrite Style",
        contextDefaultLabel: "Include Session Context",
        contextDefaultDesc: "Send workspace, project overview, recent prompts, active goal, and tasks to enrich prompt context.",
        maxTokensLabel: "Max Output Tokens Budget",
        saveSettings: "Save Settings",
        saved: "✓ Settings saved successfully!",
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
        contextTooltipActive: "会话上下文已启用（附带工作区、项目概览、近期提示词、目标与任务）",
        contextTooltipInactive: "会话上下文已关闭（点击开启）",
        contextSummary: "已检测上下文",
        outputLang: "输出语言",
        outputLangAuto: "Auto",
        outputLangEn: "EN",
        outputLangTooltipAuto: "按草稿语言输出（点击强制英文）",
        outputLangTooltipEn: "强制输出英文（点击恢复草稿语言）",
        streaming: "正在流式生成…",
        completed: "已完成",
        settingsTitle: "Prompt Polish 设置",
        settingsDesc: "为此环境配置用于提示词润色的大模型与风格。",
        modelLabel: "润色所用 LLM 模型",
        modelAuto: "🤖 自动（DSH 当前默认模型）",
        modelDesc: "选择要使用的模型。自动模式下，插件将自动适配各台电脑上可用的模型。",
        defaultStyleLabel: "默认润色风格",
        contextDefaultLabel: "附带会话上下文",
        contextDefaultDesc: "自动包含工作区、项目概览、近期提示词、活跃目标与待办任务。",
        maxTokensLabel: "最大生成 Token 预算",
        saveSettings: "保存设置",
        saved: "✓ 设置已成功保存！",
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

    // Native DSH geometry: IconOutputLang (globe)
    function IconOutputLang() {
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
        h("circle", { cx: "8", cy: "8", r: "6" }),
        h("path", { d: "M2.5 6.5H13.5" }),
        h("path", { d: "M2.5 9.5H13.5" }),
        h("path", { d: "M8 2C5.8 4.7 5.8 11.3 8 14C10.2 11.3 10.2 4.7 8 2Z" })
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

    /** Settings Form component rendered inside DSH's official Plugins page */
    function PromptPolishSettingsForm() {
      const lang = detectLang();
      const loc = LOCALES[lang] || LOCALES.en;

      const [models, setModels] = React.useState([]);
      const [defaultSelection, setDefaultSelection] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [saveMsg, setSaveMsg] = React.useState(false);

      const [selectedModel, setSelectedModel] = React.useState(() => {
        try {
          return localStorage.getItem(STORAGE_MODEL_KEY) || "auto";
        } catch {
          return "auto";
        }
      });

      const [style, setStyle] = React.useState(() => {
        try {
          const s = localStorage.getItem(STORAGE_STYLE_KEY);
          if (s === "concise" || s === "detailed" || s === "code" || s === "balanced") return s;
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

      const [maxTokens, setMaxTokens] = React.useState(() => {
        try {
          const val = parseInt(localStorage.getItem(STORAGE_MAX_TOKENS_KEY) || "2000", 10);
          return isNaN(val) ? 2000 : val;
        } catch {
          return 2000;
        }
      });

      React.useEffect(() => {
        let alive = true;
        fetch("/dsh-prompt-polish/models")
          .then((res) => res.json())
          .then((data) => {
            if (!alive) return;
            setModels(data.models || []);
            setDefaultSelection(data.defaultSelection || null);
            setLoading(false);
          })
          .catch(() => {
            if (!alive) return;
            setLoading(false);
          });
        return () => {
          alive = false;
        };
      }, []);

      const onSave = () => {
        try {
          localStorage.setItem(STORAGE_MODEL_KEY, selectedModel);
          localStorage.setItem(STORAGE_STYLE_KEY, style);
          localStorage.setItem(STORAGE_CONTEXT_KEY, String(withContext));
          localStorage.setItem(STORAGE_MAX_TOKENS_KEY, String(maxTokens));
          setSaveMsg(true);
          setTimeout(() => setSaveMsg(false), 3000);
        } catch {}
      };

      const defaultModelName = defaultSelection ? `${defaultSelection.model} (${defaultSelection.provider})` : "";

      return h(
        "div",
        { className: "pp-settings-container" },
        h(
          "div",
          { className: "pp-settings-card" },
          h(
            "div",
            { className: "pp-settings-header" },
            h("span", { className: "pp-settings-title" }, loc.settingsTitle),
            h("span", { className: "pp-settings-subtitle" }, loc.settingsDesc)
          ),
          // Model Field
          h(
            "div",
            { className: "pp-settings-field" },
            h("label", { className: "pp-settings-label" }, loc.modelLabel),
            h(
              "select",
              {
                className: "pp-settings-select",
                value: selectedModel,
                onChange: (e) => setSelectedModel(e.target.value),
                disabled: loading,
              },
              h(
                "option",
                { value: "auto" },
                `${loc.modelAuto} ${defaultModelName ? `— ${defaultModelName}` : ""}`
              ),
              models.map((m) =>
                h(
                  "option",
                  { key: `${m.provider}:${m.model}`, value: `${m.provider}:${m.model}` },
                  m.name
                )
              )
            ),
            h("span", { className: "pp-settings-desc" }, loc.modelDesc)
          ),
          // Style Field
          h(
            "div",
            { className: "pp-settings-field" },
            h("label", { className: "pp-settings-label" }, loc.defaultStyleLabel),
            h(
              "select",
              {
                className: "pp-settings-select",
                value: style,
                onChange: (e) => setStyle(e.target.value),
              },
              h("option", { value: "balanced" }, loc.styles.balanced),
              h("option", { value: "concise" }, loc.styles.concise),
              h("option", { value: "detailed" }, loc.styles.detailed),
              h("option", { value: "code" }, loc.styles.code)
            )
          ),
          // Context Checkbox Field
          h(
            "div",
            { className: "pp-settings-field" },
            h(
              "label",
              { className: "pp-settings-checkbox-row" },
              h("input", {
                type: "checkbox",
                className: "pp-settings-checkbox",
                checked: withContext,
                onChange: (e) => setWithContext(e.target.checked),
              }),
              h("span", { className: "pp-settings-label" }, loc.contextDefaultLabel)
            ),
            h("span", { className: "pp-settings-desc" }, loc.contextDefaultDesc)
          ),
          // Max Tokens Field
          h(
            "div",
            { className: "pp-settings-field" },
            h("label", { className: "pp-settings-label" }, loc.maxTokensLabel),
            h("input", {
              type: "number",
              className: "pp-settings-input",
              min: 100,
              max: 8000,
              step: 100,
              value: maxTokens,
              onChange: (e) => setMaxTokens(parseInt(e.target.value, 10) || 2000),
            })
          ),
          // Footer Save Actions
          h(
            "div",
            { className: "pp-settings-footer" },
            h(
              "button",
              { type: "button", className: "pp-settings-save-btn", onClick: onSave },
              loc.saveSettings
            ),
            saveMsg ? h("span", { className: "pp-settings-msg" }, loc.saved) : null
          )
        )
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

      const [forceEnglish, setForceEnglish] = React.useState(() => {
        try {
          return localStorage.getItem(STORAGE_OUTLANG_KEY) === "en";
        } catch {
          return false;
        }
      });

      const [selectedModel, setSelectedModel] = React.useState(() => {
        try {
          return localStorage.getItem(STORAGE_MODEL_KEY) || "auto";
        } catch {
          return "auto";
        }
      });

      const [availableModels, setAvailableModels] = React.useState([]);
      const [defaultModelInfo, setDefaultModelInfo] = React.useState(null);

      const [previewOpen, setPreviewOpen] = React.useState(false);
      const [previewOriginal, setPreviewOriginal] = React.useState("");
      const [previewPolished, setPreviewPolished] = React.useState("");
      const [previewStatus, setPreviewStatus] = React.useState("streaming");
      const [activeRouteInfo, setActiveRouteInfo] = React.useState("");
      const [copied, setCopied] = React.useState(false);

      const abortControllerRef = React.useRef(null);
      const aliveRef = React.useRef(true);
      const lang = detectLang();
      const loc = LOCALES[lang] || LOCALES.en;

      // Fetch models on mount
      React.useEffect(() => {
        let alive = true;
        fetch("/dsh-prompt-polish/models")
          .then((res) => res.json())
          .then((data) => {
            if (!alive) return;
            setAvailableModels(data.models || []);
            setDefaultModelInfo(data.defaultSelection || null);
          })
          .catch(() => {});
        return () => {
          alive = false;
        };
      }, []);

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

      const toggleOutputLang = () => {
        setForceEnglish((prev) => {
          const next = !prev;
          try {
            localStorage.setItem(STORAGE_OUTLANG_KEY, next ? "en" : "auto");
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
        setActiveRouteInfo("");
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

        let reqProvider;
        let reqModel;
        if (selectedModel && selectedModel !== "auto" && selectedModel.includes(":")) {
          const parts = selectedModel.split(":");
          reqProvider = parts[0];
          reqModel = parts.slice(1).join(":");
        }

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
              provider: reqProvider,
              model: reqModel,
              stream: true,
              context: contextData,
              outputLang: forceEnglish ? "en" : "auto",
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
                    if (ev.model) {
                      setActiveRouteInfo(`${ev.model}${ev.provider ? ` (${ev.provider})` : ""}`);
                    }
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
      }, [busy, inputActions, text, style, sessionId, withContext, forceEnglish, selectedModel, activeCwd, goalObj, todosList, loc, onCancel]);

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

      const handleModalModelChange = (newVal) => {
        setSelectedModel(newVal);
        try {
          localStorage.setItem(STORAGE_MODEL_KEY, newVal);
        } catch {}
      };

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
                            `${withContext ? "🧠 Context · " : ""}${
                              activeRouteInfo ? `🤖 ${activeRouteInfo} · ` : ""
                            }${loc.completed}`
                          )
                    ),
                    // Model switcher in modal foot
                    h(
                      "div",
                      { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 12 } },
                      h("span", { style: { color: "var(--dsw-alias-label-secondary)" } }, "Model:"),
                      h(
                        "select",
                        {
                          className: "pp-select",
                          style: { height: 26, fontSize: 12, paddingRight: 16 },
                          value: selectedModel,
                          onChange: (e) => handleModalModelChange(e.target.value),
                        },
                        h(
                          "option",
                          { value: "auto" },
                          `Auto (${defaultModelInfo ? defaultModelInfo.model : "DSH Default"})`
                        ),
                        availableModels.map((m) =>
                          h(
                            "option",
                            { key: `${m.provider}:${m.model}`, value: `${m.provider}:${m.model}` },
                            m.name
                          )
                        )
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
          // Native DSH trigger: Output language toggle (draft language <-> force English)
          h(
            "button",
            {
              type: "button",
              className: `pp-btn ${forceEnglish ? "pp-btn-lang-active" : "pp-btn-lang-auto"}`,
              onClick: toggleOutputLang,
              title: forceEnglish ? loc.outputLangTooltipEn : loc.outputLangTooltipAuto,
              "aria-label": loc.outputLang,
              "aria-pressed": forceEnglish,
            },
            h(IconOutputLang),
            h("span", null, forceEnglish ? loc.outputLangEn : loc.outputLangAuto)
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

      // 1. Composer toolbar
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

      // 2. Plugins Settings Page: Row config
      ctx.slots.inject("plugins.row.config", () =>
        ctx.slots.register(
          {
            id: `${PLUGIN}#prompt-polish`,
            name: "plugins.row.config",
            key: `${PLUGIN}#prompt-polish`,
            label: () => "Prompt Polish Configuration",
          },
          (slotProps) =>
            slotProps && slotProps.view === "summary"
              ? h(
                  "span",
                  null,
                  "Ottimizzazione automatica dei prompt con AI, supporto streaming SSE e selezione modello LLM."
                )
              : h(PromptPolishSettingsForm)
        )
      );

      // 3. Plugins Settings Page: Bundle config
      ctx.slots.inject("plugins.bundle.config", () =>
        ctx.slots.register(
          {
            id: PLUGIN,
            name: "plugins.bundle.config",
            key: PLUGIN,
            label: () => "Prompt Polish Configuration",
          },
          (slotProps) =>
            slotProps && slotProps.view === "summary"
              ? h(
                  "span",
                  null,
                  "Ottimizzazione automatica dei prompt con AI, supporto streaming SSE e selezione modello LLM."
                )
              : h(PromptPolishSettingsForm)
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
