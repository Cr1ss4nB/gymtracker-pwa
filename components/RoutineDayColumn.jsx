import RoutineExerciseCard from './RoutineExerciseCard'

const DAY_NAMES = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const RoutineDayColumn = ({ dayNumber, exercises, onAddExercise, onUpdateExercise, onRemoveExercise }) => {
  const isEmpty = !exercises || exercises.length === 0

  return (
    <div className={`day-column ${isEmpty ? 'day-column--empty' : ''}`}>
      <div className="day-column__header">
        <span className="day-column__name">{DAY_NAMES[dayNumber]}</span>
        <span className="day-column__count">{exercises?.length || 0} ejercicios</span>
      </div>

      <div className="day-column__exercises">
        {exercises && exercises.map(re => (
          <RoutineExerciseCard
            key={re.id}
            routineExercise={re}
            onUpdate={onUpdateExercise}
            onRemove={onRemoveExercise}
          />
        ))}

        {isEmpty && (
          <div className="day-column__empty-hint">Día de descanso</div>
        )}
      </div>

      <button
        className="day-column__add-btn"
        onClick={() => onAddExercise(dayNumber)}
        type="button"
      >
        + Agregar
      </button>
    </div>
  )
}

export default RoutineDayColumn
