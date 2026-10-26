export const PLUGIN = 'dsh-prompt-polish'
export const STYLE_ID = 'dsh-prompt-polish-style'

export const CSS = `
#dsh-prompt-polish-style .pp-group {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  position: relative;
  font-family: inherit;
  font-size: 13px;
  line-height: 20px;
  height: 28px;
}

/* DSH native-conforming ghost button style */
#dsh-prompt-polish-style .pp-btn {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 28px;
  padding: 0 6px 0 6px;
  border-radius: var(--dsw-radius-sm, 6px);
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #9ca3af);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  transition: background 0.12s ease, color 0.12s ease;
  user-select: none;
}

#dsh-prompt-polish-style .pp-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.08));
  color: var(--dsw-alias-label-primary, #ffffff);
}

#dsh-prompt-polish-style .pp-btn:focus-visible {
  box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary, #4a7cff));
}

#dsh-prompt-polish-style .pp-btn:disabled {
  color: var(--dsw-alias-label-dimmed, rgba(156, 163, 175, 0.4));
  cursor: default;
  opacity: 0.5;
}

/* Context toggle state indicator */
#dsh-prompt-polish-style .pp-btn-context-active {
  color: var(--dsw-alias-label-primary, #ffffff);
}

#dsh-prompt-polish-style .pp-btn-context-inactive {
  color: var(--dsw-alias-label-tertiary, #6b7280);
}

#dsh-prompt-polish-style .pp-context-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  flex: none;
}

#dsh-prompt-polish-style .pp-context-dot-off {
  background: var(--dsw-alias-label-caption, #4b5563);
}

/* Polishing in-flight state */
#dsh-prompt-polish-style .pp-btn-busy {
  color: #f59e0b;
}

#dsh-prompt-polish-style .pp-btn-busy:hover {
  background: var(--dsw-alias-interactive-bg-hover-danger, rgba(239, 68, 68, 0.15)) !important;
  color: #ef4444 !important;
}

/* Style select trigger wrapper matching DSH dropdowns */
#dsh-prompt-polish-style .pp-select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 28px;
}

#dsh-prompt-polish-style .pp-select {
  height: 28px;
  padding: 0 18px 0 6px;
  border-radius: var(--dsw-radius-sm, 6px);
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #9ca3af);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  transition: background 0.12s ease, color 0.12s ease;
}

#dsh-prompt-polish-style .pp-select:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.08));
  color: var(--dsw-alias-label-primary, #ffffff);
}

#dsh-prompt-polish-style .pp-select-chevron {
  position: absolute;
  right: 5px;
  pointer-events: none;
  color: var(--dsw-alias-label-caption, #6b7280);
  display: inline-flex;
  align-items: center;
}

#dsh-prompt-polish-style .pp-select option {
  background: var(--dsw-alias-bg-surface-l1, #1e1e1e);
  color: var(--dsw-alias-label-primary, #ffffff);
}

/* DSH native-conforming 14px monochrome SVG icons */
#dsh-prompt-polish-style .pp-icon-svg {
  width: 14px;
  height: 14px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  fill: currentColor;
  color: inherit;
}

#dsh-prompt-polish-style .pp-spin {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(156, 163, 175, 0.25);
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: ppSpin 0.7s linear infinite;
  display: inline-block;
  flex: none;
}

#dsh-prompt-polish-style .pp-err {
  font-size: 11px;
  color: var(--dsw-alias-state-error-primary, #e5484d);
  max-width: 180px;
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
  border-radius: var(--dsw-radius-sm, 6px);
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
  height: 28px;
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
`

export function ensureStyle(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID) !== null) return
  const tag = document.createElement('style')
  tag.id = STYLE_ID
  tag.dataset.plugin = PLUGIN
  tag.textContent = CSS
  document.head.appendChild(tag)
}
