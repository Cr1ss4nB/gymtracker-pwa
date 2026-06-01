const ExerciseCard = ({ exercise, onAdd = null }) => {
  const {
    name,
    muscle_group,
    submuscles = [],
    equipment,
    difficulty,
    description,
    is_home,
    image_url
  } = exercise

  const difficultyColor = {
    'Principiante': '#28a745',
    'Intermedio':   '#f5a623',
    'Avanzado':     '#e94560',
  }

  const muscleEmoji = {
    'Piernas':       '🦵',
    'Pecho':         '💪',
    'Espalda':       '🔙',
    'Hombros':       '🏋️',
    'Brazos':        '💪',
    'Core':          '🎯',
    'Cardio':        '🏃',
    'Cuerpo completo': '⚡',
  }

  const emoji = muscleEmoji[muscle_group] || '🏋️'
  const color = difficultyColor[difficulty] || '#888'

  return (
    <article className="exercise-card">
      {/* Imagen o fallback visual */}
      <div className="exercise-card__image">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="exercise-card__image-fallback">
            <span>{emoji}</span>
          </div>
        )}

        {/* Badge de dificultad sobre la imagen */}
        <span
          className="exercise-card__difficulty"
          style={{ backgroundColor: color }}
        >
          {difficulty}
        </span>

        {/* Indicador home/gym */}
        {is_home && (
          <span className="exercise-card__home-badge" title="Puede hacerse en casa">
            🏠
          </span>
        )}
      </div>

      {/* Cuerpo de la card */}
      <div className="exercise-card__body">
        <h3 className="exercise-card__name">{name}</h3>

        <div className="exercise-card__meta">
          <span className="exercise-card__muscle">{muscle_group}</span>
          <span className="exercise-card__equipment">{equipment}</span>
        </div>

        {/* Submúsculos como chips */}
        {submuscles && submuscles.length > 0 && (
          <div className="exercise-card__submuscles">
            {submuscles.slice(0, 3).map((sub, i) => (
              <span key={i} className="exercise-card__submuscle-chip">{sub}</span>
            ))}
          </div>
        )}

        {/* Descripción breve */}
        {description && (
          <p className="exercise-card__description">{description}</p>
        )}

        {/* Botón agregar — solo si se pasa el callback onAdd */}
        {onAdd && (
          <button
            className="exercise-card__add-btn"
            onClick={() => onAdd(exercise)}
            type="button"
          >
            + Agregar
          </button>
        )}
      </div>
    </article>
  )
}

export default ExerciseCard
