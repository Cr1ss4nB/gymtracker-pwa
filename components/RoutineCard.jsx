// Muestra metadata de una rutina guardada con acciones de activar/eliminar.
const TYPE_LABELS = {
  FULL_BODY: 'Full Body',
  PPL: 'Push Pull Legs',
  UPPER_LOWER: 'Upper / Lower',
}

const RoutineCard = ({ routine, onActivate, onDelete }) => {
  const {
    name,
    description,
    template_type,
    days_per_week,
    is_active,
  } = routine

  return (
    <div className={`routine-card ${is_active ? 'routine-card--active' : ''}`}>
      {is_active && (
        <span className="routine-card__active-badge">Activa</span>
      )}

      <div className="routine-card__header">
        <h3 className="routine-card__name">{name}</h3>
      </div>

      <div className="routine-card__meta">
        {template_type && (
          <span className="routine-card__badge routine-card__badge--type">
            {TYPE_LABELS[template_type] || template_type}
          </span>
        )}
        {days_per_week && (
          <span className="routine-card__badge routine-card__badge--days">
            {days_per_week} días/sem
          </span>
        )}
      </div>

      {description && (
        <p className="routine-card__description">{description}</p>
      )}

      <div className="routine-card__actions">
        {!is_active && (
          <button
            type="button"
            className="routine-card__btn routine-card__btn--activate"
            onClick={() => onActivate(routine)}
          >
            Activar
          </button>
        )}
        <button
          type="button"
          className="routine-card__btn routine-card__btn--delete"
          onClick={() => onDelete(routine)}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export default RoutineCard
