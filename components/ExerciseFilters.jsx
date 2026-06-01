// Si la BD agrega nuevos valores, se actualiza aquí o se puede cargar dinámicamente
const MUSCLE_GROUPS = [
  'Piernas', 'Pecho', 'Espalda', 'Hombros', 'Brazos', 'Core', 'Cardio', 'Cuerpo completo'
]

const EQUIPMENT_OPTIONS = [
  'Barra', 'Mancuerna', 'Mancuernas', 'Máquina', 'Cable',
  'Peso corporal', 'Kettlebell', 'Caja', 'Barra EZ', 'Cuerdas'
]

const DIFFICULTY_OPTIONS = ['Principiante', 'Intermedio', 'Avanzado']

const ExerciseFilters = ({ filters, onChange, onReset, resultCount }) => {
  const hasActiveFilters = (
    filters.muscle_group ||
    filters.equipment ||
    filters.difficulty ||
    filters.is_home ||
    filters.search
  )

  return (
    <div className="exercise-filters">
      {/* Barra de búsqueda */}
      <div className="exercise-filters__search-row">
        <div className="exercise-filters__search-wrap">
          <span className="exercise-filters__search-icon">🔍</span>
          <input
            type="text"
            className="exercise-filters__search"
            placeholder="Buscar ejercicio..."
            value={filters.search || ''}
            onChange={(e) => onChange('search', e.target.value)}
          />
          {filters.search && (
            <button
              className="exercise-filters__clear-search"
              onClick={() => onChange('search', '')}
              type="button"
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Contador de resultados */}
        <span className="exercise-filters__count">
          {resultCount} ejercicio{resultCount !== 1 ? 's' : ''}
        </span>

        {/* Botón reset — solo visible si hay filtros activos */}
        {hasActiveFilters && (
          <button
            className="exercise-filters__reset"
            onClick={onReset}
            type="button"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Chips de filtros */}
      <div className="exercise-filters__chips-area">

        {/* Grupo muscular */}
        <div className="exercise-filters__group">
          <span className="exercise-filters__group-label">Músculo</span>
          <div className="exercise-filters__chips">
            {MUSCLE_GROUPS.map((mg) => (
              <button
                key={mg}
                type="button"
                className={`exercise-filters__chip ${filters.muscle_group === mg ? 'active' : ''}`}
                onClick={() => onChange('muscle_group', filters.muscle_group === mg ? '' : mg)}
              >
                {mg}
              </button>
            ))}
          </div>
        </div>

        {/* Dificultad */}
        <div className="exercise-filters__group">
          <span className="exercise-filters__group-label">Dificultad</span>
          <div className="exercise-filters__chips">
            {DIFFICULTY_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                className={`exercise-filters__chip difficulty-${d.toLowerCase()} ${filters.difficulty === d ? 'active' : ''}`}
                onClick={() => onChange('difficulty', filters.difficulty === d ? '' : d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Equipamiento */}
        <div className="exercise-filters__group">
          <span className="exercise-filters__group-label">Equipamiento</span>
          <div className="exercise-filters__chips">
            {EQUIPMENT_OPTIONS.map((eq) => (
              <button
                key={eq}
                type="button"
                className={`exercise-filters__chip ${filters.equipment === eq ? 'active' : ''}`}
                onClick={() => onChange('equipment', filters.equipment === eq ? '' : eq)}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle en casa */}
        <div className="exercise-filters__group">
          <span className="exercise-filters__group-label">Dónde</span>
          <div className="exercise-filters__chips">
            <button
              type="button"
              className={`exercise-filters__chip ${filters.is_home === true ? 'active' : ''}`}
              onClick={() => onChange('is_home', filters.is_home === true ? null : true)}
            >
              🏠 En casa
            </button>
            <button
              type="button"
              className={`exercise-filters__chip ${filters.is_home === false ? 'active' : ''}`}
              onClick={() => onChange('is_home', filters.is_home === false ? null : false)}
            >
              🏋️ Solo gym
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ExerciseFilters
