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
    cancelTooltip: 'Interrompi la richiesta AI',
    undo: 'Ripristina',
    undoTooltip: 'Ripristina la bozza originale',
    tooltip: 'Perfeziona la bozza corrente con l\'AI',
    styleTooltip: 'Seleziona stile di riscrittura',
    truncated: 'Risultato parzialmente troncato (limite token)',
    failed: 'Perfezionamento fallito',
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
    cancelTooltip: 'Abort in-flight polish request',
    undo: 'Undo',
    undoTooltip: 'Restore original draft',
    tooltip: 'Polish current draft with AI',
    styleTooltip: 'Select rewrite style',
    truncated: 'Result partially truncated (token budget reached)',
    failed: 'Polish failed',
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
    cancelTooltip: '取消当前润色请求',
    undo: '撤销',
    undoTooltip: '恢复原草稿',
    tooltip: '用 AI 润色当前输入为专业提示词',
    styleTooltip: '选择润色风格',
    truncated: '润色结果较长，已写入（部分截断）',
    failed: '润色失败',
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
