const EmptyRoutineState = ({ onUseTemplate, onCreateManual }) => {
  return (
    <div className="empty-routine">
      <div className="empty-routine__icon">📋</div>
      <h2 className="empty-routine__title">Sin rutina activa</h2>
      <p className="empty-routine__sub">
        Elige una plantilla o crea tu rutina desde cero
      </p>
      <div className="empty-routine__actions">
        <button className="empty-routine__btn empty-routine__btn--primary" onClick={onUseTemplate} type="button">
          Usar plantilla
        </button>
        <button className="empty-routine__btn empty-routine__btn--secondary" onClick={onCreateManual} type="button">
          Crear manual
        </button>
      </div>
    </div>
  )
}

export default EmptyRoutineState
