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
  contextTooltip: string
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
    cancelTooltip: 'Interrompi la richiesta AI',
    undo: 'Ripristina',
    undoTooltip: 'Ripristina la bozza originale',
    tooltip: 'Perfeziona la bozza corrente con l\'AI',
    styleTooltip: 'Seleziona stile di riscrittura',
    truncated: 'Risultato parzialmente troncato (limite token)',
    failed: 'Perfezionamento fallito',
    previewTitle: '✨ Confronto Perfezionamento Prompt',
    original: 'Bozza Originale',
    polished: 'Proposta Ottimizzata AI',
    accept: 'Accetta nel box',
    reject: 'Rifiuta',
    copy: 'Copia',
    copied: 'Copiato!',
    context: 'Contesto',
    contextTooltip: 'Includi cartella di lavoro, task attivi e obiettivo di sessione per arricchire il prompt',
    streaming: 'Generazione in corso…',
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
    cancelTooltip: 'Abort in-flight polish request',
    undo: 'Undo',
    undoTooltip: 'Restore original draft',
    tooltip: 'Polish current draft with AI',
    styleTooltip: 'Select rewrite style',
    truncated: 'Result partially truncated (token budget reached)',
    failed: 'Polish failed',
    previewTitle: '✨ Prompt Polish Diff & Review',
    original: 'Original Draft',
    polished: 'AI Polished Prompt',
    accept: 'Accept into composer',
    reject: 'Discard',
    copy: 'Copy',
    copied: 'Copied!',
    context: 'Context',
    contextTooltip: 'Include workspace folder, active tasks, and session goal to enrich prompt details',
    streaming: 'Streaming response…',
    completed: 'Complete',
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
    previewTitle: '✨ 提示词润色对比',
    original: '原始草稿',
    polished: 'AI 优化提示词',
    accept: '采纳并填入',
    reject: '放弃',
    copy: '复制',
    copied: '已复制！',
    context: '会话上下文',
    contextTooltip: '附带工作区路径、活跃任务与当前目标以强化提示词细节',
    streaming: '正在流式生成…',
    completed: '完成',
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
