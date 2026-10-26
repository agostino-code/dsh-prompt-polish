export const PLUGIN = 'dsh-prompt-polish'
export const STYLE_ID = 'dsh-prompt-polish-style'

export const CSS = `
#dsh-prompt-polish-style .pp-group {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  position: relative;
  font-family: inherit;
  font-size: 12px;
}

#dsh-prompt-polish-style .pp-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 7px;
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
