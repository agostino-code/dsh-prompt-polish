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
  streaming: string
  completed: string
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
    contextTooltipActive: 'Contesto di sessione ATTIVO (include cartella workspace, goal e task)',
    contextTooltipInactive: 'Contesto di sessione DISATTIVO (clicca per attivare)',
    contextSummary: 'Contesto rilevato',
    streaming: 'Generazione in tempo reale…',
    completed: 'Completato',
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
    contextTooltipActive: 'Session context ACTIVE (includes workspace path, goal, and tasks)',
    contextTooltipInactive: 'Session context INACTIVE (click to enable)',
    contextSummary: 'Context detected',
    streaming: 'Streaming response…',
    completed: 'Completed',
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
    contextTooltipActive: '会话上下文已启用（附带工作区、目标与任务）',
    contextTooltipInactive: '会话上下文已关闭（点击开启）',
    contextSummary: '已检测上下文',
    streaming: '正在流式生成…',
    completed: '已完成',
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
