export const PLUGIN = 'dsh-prompt-polish'
export const STYLE_ID = 'dsh-prompt-polish-style'

export const CSS = `
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
