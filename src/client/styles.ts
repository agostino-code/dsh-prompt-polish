export const PLUGIN = 'dsh-prompt-polish'
export const STYLE_ID = 'dsh-prompt-polish-style'

export const CSS = `
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
