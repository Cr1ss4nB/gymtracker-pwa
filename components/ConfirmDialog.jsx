const ConfirmDialog = ({ isOpen, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm, onCancel, danger = false }) => {
  if (!isOpen) return null

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
        <h3 className="confirm-title">{title}</h3>
        {message && <p className="confirm-message">{message}</p>}
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn--cancel" onClick={onCancel} type="button">
            {cancelLabel}
          </button>
          <button
            className={`confirm-btn ${danger ? 'confirm-btn--danger' : 'confirm-btn--primary'}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
