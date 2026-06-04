import { useState, useEffect, useCallback } from 'react'
import { getExercises } from '../js/exercises/exercises.api'
import ExerciseCard from './ExerciseCard'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

// token ya no es necesario: exercises.api lo lee de localStorage internamente
const ExercisePicker = ({ onAdd, onClose, defaultDay = 1 }) => {
  const [exercises, setExercises] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(defaultDay)
  const [adding, setAdding] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getExercises({})
        setExercises(data)
      } catch (err) {
        console.error('ExercisePicker load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = exercises.filter(ex => {
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return (
      ex.name.toLowerCase().includes(term) ||
      ex.muscle_group.toLowerCase().includes(term)
    )
  })

  const handleAdd = useCallback(async (exercise) => {
    setAdding(exercise.id)
    try {
      await onAdd(exercise.id, selectedDay)
    } finally {
      setAdding(null)
    }
  }, [onAdd, selectedDay])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box exercise-picker" onClick={e => e.stopPropagation()}>
        <div className="modal-box__header">
          <h2 className="modal-box__title">Agregar ejercicio</h2>
          <button className="modal-box__close" onClick={onClose} type="button">✕</button>
        </div>

        {/* Selector de día */}
        <div className="exercise-picker__day-selector">
          <span className="exercise-picker__day-label">Agregar al día:</span>
          <div className="exercise-picker__days">
            {DAYS.map((name, i) => (
              <button
                key={i + 1}
                type="button"
                className={`exercise-picker__day-btn ${selectedDay === i + 1 ? 'active' : ''}`}
                onClick={() => setSelectedDay(i + 1)}
              >
                {name.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Búsqueda */}
        <div className="exercise-picker__search-wrap">
          <input
            type="text"
            className="exercise-picker__search"
            placeholder="Buscar ejercicio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Grid */}
        <div className="exercise-picker__grid">
          {loading ? (
            <p className="exercise-picker__loading">Cargando ejercicios...</p>
          ) : filtered.length === 0 ? (
            <p className="exercise-picker__empty">Sin resultados</p>
          ) : (
            filtered.map(ex => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onAdd={adding === ex.id ? null : handleAdd}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ExercisePicker
