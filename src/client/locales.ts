export type Lang = 'it' | 'en' | 'zh'
export type PolishStyle = 'balanced' | 'concise' | 'detailed' | 'code'

export interface LocaleStrings {
  polish: string
  polishing: string
  cancel: string
  cancelTooltip: string
  undo: string
  undoTooltip: string
  tooltip: string
  styleTooltip: string
  truncated: string
  failed: string
  previewTitle: string
  original: string
  polished: string
  accept: string
  reject: string
  copy: string
  copied: string
  context: string
  contextActive: string
  contextInactive: string
  contextTooltipActive: string
  contextTooltipInactive: string
  contextSummary: string
  outputLang: string
  outputLangTooltipAuto: string
  outputLangTooltipEn: string
  streaming: string
  completed: string
  settingsTitle: string
  settingsDesc: string
  modelLabel: string
  modelAuto: string
  modelDesc: string
  defaultStyleLabel: string
  contextDefaultLabel: string
  contextDefaultDesc: string
  maxTokensLabel: string
  saveSettings: string
  saved: string
  modelsLoading: string
  modelsError: string
  styles: {
    balanced: string
    concise: string
    detailed: string
    code: string
  }
}

export const LOCALES: Record<Lang, LocaleStrings> = {
  it: {
    polish: 'Perfeziona',
    polishing: 'Perfezionamento…',
    cancel: 'Annulla',
    cancelTooltip: 'Interrompi la generazione in corso',
    undo: 'Ripristina',
    undoTooltip: 'Ripristina la bozza originale',
    tooltip: 'Perfeziona il prompt corrente con l\'AI',
    styleTooltip: 'Seleziona lo stile di riscrittura',
    truncated: 'Risultato parzialmente troncato (limite token)',
    failed: 'Perfezionamento fallito',
    previewTitle: 'Revisione e Confronto Prompt',
    original: 'Bozza Originale',
    polished: 'Bozza Perfezionata',
    accept: 'Applica nel box',
    reject: 'Annulla',
    copy: 'Copia',
    copied: 'Copiato!',
    context: 'Contesto',
    contextActive: 'Attivo',
    contextInactive: 'Disattivo',
    contextTooltipActive: 'Contesto di sessione ATTIVO (include workspace, panoramica progetto, ultimi prompt, goal e task)',
    contextTooltipInactive: 'Contesto di sessione DISATTIVO (clicca per attivare)',
    contextSummary: 'Contesto rilevato',
    outputLang: 'EN',
    outputLangTooltipAuto: 'Output nella lingua della bozza (clicca per forzare l\'inglese)',
    outputLangTooltipEn: 'Output forzato in INGLESE (clicca per tornare alla lingua della bozza)',
    streaming: 'Generazione in tempo reale…',
    completed: 'Completato',
    settingsTitle: 'Impostazioni Prompt Polish',
    settingsDesc: 'Configura il modello LLM e i parametri di riscrittura dei prompt per questo ambiente.',
    modelLabel: 'Modello LLM per il Polish',
    modelAuto: '🤖 Automatico (Predefinito di DSH)',
    modelDesc: 'Seleziona il modello da usare. In modalità Automatica, il plugin si adatterà automaticamente al modello attivo su qualsiasi computer o installazione.',
    defaultStyleLabel: 'Stile di Riscrittura Predefinito',
    contextDefaultLabel: 'Includi Contesto di Sessione',
    contextDefaultDesc: 'Invia workspace, panoramica del progetto, ultimi prompt, obiettivi e compiti per arricchire il prompt.',
    maxTokensLabel: 'Budget Massimo Token Risposta',
    saveSettings: 'Salva Impostazioni',
    saved: '✓ Impostazioni salvate con successo!',
    modelsLoading: 'Caricamento modelli disponibili…',
    modelsError: 'Impossibile interrogare l\'elenco modelli',
    styles: {
      balanced: 'Bilanciato',
      concise: 'Conciso',
      detailed: 'Dettagliato',
      code: 'Codice',
    },
  },
  en: {
    polish: 'Polish',
    polishing: 'Polishing…',
    cancel: 'Cancel',
    cancelTooltip: 'Abort ongoing generation',
    undo: 'Undo',
    undoTooltip: 'Restore original draft',
    tooltip: 'Polish current draft with AI',
    styleTooltip: 'Select rewrite style',
    truncated: 'Result partially truncated (token budget reached)',
    failed: 'Polish failed',
    previewTitle: 'Prompt Review & Diff',
    original: 'Original Draft',
    polished: 'Polished Draft',
    accept: 'Apply to composer',
    reject: 'Discard',
    copy: 'Copy',
    copied: 'Copied!',
    context: 'Context',
    contextActive: 'Active',
    contextInactive: 'Inactive',
    contextTooltipActive: 'Session context ACTIVE (includes workspace, project overview, recent prompts, goal, and tasks)',
    contextTooltipInactive: 'Session context INACTIVE (click to enable)',
    contextSummary: 'Context detected',
    outputLang: 'EN',
    outputLangTooltipAuto: 'Output in the draft language (click to force English)',
    outputLangTooltipEn: 'Output forced to ENGLISH (click to return to the draft language)',
    streaming: 'Streaming response…',
    completed: 'Completed',
    settingsTitle: 'Prompt Polish Settings',
    settingsDesc: 'Configure the LLM model and prompt rewriting parameters for this environment.',
    modelLabel: 'LLM Model for Polish',
    modelAuto: '🤖 Automatic (DSH Default Model)',
    modelDesc: 'Select the model to use. In Automatic mode, the plugin adapts to whichever model is active on any computer.',
    defaultStyleLabel: 'Default Rewrite Style',
    contextDefaultLabel: 'Include Session Context',
    contextDefaultDesc: 'Send workspace, project overview, recent prompts, active goal, and tasks to enrich prompt context.',
    maxTokensLabel: 'Max Output Tokens Budget',
    saveSettings: 'Save Settings',
    saved: '✓ Settings saved successfully!',
    modelsLoading: 'Loading available models…',
    modelsError: 'Failed to fetch models list',
    styles: {
      balanced: 'Balanced',
      concise: 'Concise',
      detailed: 'Detailed',
      code: 'Code',
    },
  },
  zh: {
    polish: '润色',
    polishing: '润色中…',
    cancel: '取消',
    cancelTooltip: '中止生成',
    undo: '撤销',
    undoTooltip: '恢复原草稿',
    tooltip: '用 AI 优化提示词',
    styleTooltip: '选择润色风格',
    truncated: '结果较长（已截断）',
    failed: '润色失败',
    previewTitle: '提示词对比与审查',
    original: '原始输入',
    polished: '优化结果',
    accept: '填入输入框',
    reject: '放弃',
    copy: '复制',
    copied: '已复制！',
    context: '上下文',
    contextActive: '已开启',
    contextInactive: '已关闭',
    contextTooltipActive: '会话上下文已启用（附带工作区、项目概览、近期提示词、目标与任务）',
    contextTooltipInactive: '会话上下文已关闭（点击开启）',
    contextSummary: '已检测上下文',
    outputLang: 'EN',
    outputLangTooltipAuto: '按草稿语言输出（点击强制英文）',
    outputLangTooltipEn: '强制输出英文（点击恢复草稿语言）',
    streaming: '正在流式生成…',
    completed: '已完成',
    settingsTitle: 'Prompt Polish 设置',
    settingsDesc: '为此环境配置用于提示词润色的大模型与风格。',
    modelLabel: '润色所用 LLM 模型',
    modelAuto: '🤖 自动（DSH 当前默认模型）',
    modelDesc: '选择要使用的模型。自动模式下，插件将自动适配各台电脑上可用的模型。',
    defaultStyleLabel: '默认润色风格',
    contextDefaultLabel: '附带会话上下文',
    contextDefaultDesc: '自动包含工作区、项目概览、近期提示词、活跃目标与待办任务。',
    maxTokensLabel: '最大生成 Token 预算',
    saveSettings: '保存设置',
    saved: '✓ 设置已成功保存！',
    modelsLoading: '正在加载可用模型…',
    modelsError: '获取模型列表失败',
    styles: {
      balanced: '平衡',
      concise: '简洁',
      detailed: '详细',
      code: '代码',
    },
  },
}

export function detectLang(): Lang {
  if (typeof navigator === 'undefined' || !navigator.language) return 'en'
  const nav = navigator.language.toLowerCase()
  if (nav.startsWith('it')) return 'it'
  if (nav.startsWith('zh')) return 'zh'
  return 'en'
}
