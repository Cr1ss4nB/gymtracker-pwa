import { useState } from 'react'

const RoutineExerciseCard = ({ routineExercise, onUpdate, onRemove }) => {
  const { id, day_number, target_sets, target_reps, rest_seconds, exercises: ex } = routineExercise
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ target_sets, target_reps, rest_seconds })
  const [saving, setSaving] = useState(false)

  if (!ex) return null

  const difficultyColor = { Principiante: '#28a745', Intermedio: '#f5a623', Avanzado: '#e94560' }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onUpdate(id, {
        target_sets: parseInt(form.target_sets),
        target_reps: parseInt(form.target_reps),
        rest_seconds: parseInt(form.rest_seconds)
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = () => onRemove(id, day_number)

  return (
    <div className="routine-ex-card">
      <div className="routine-ex-card__left">
        <div className="routine-ex-card__muscle-dot" style={{ backgroundColor: difficultyColor[ex.difficulty] || '#666' }} />
        <div className="routine-ex-card__info">
          <span className="routine-ex-card__name">{ex.name}</span>
          <span className="routine-ex-card__muscle">{ex.muscle_group} · {ex.equipment}</span>
        </div>
      </div>

      <div className="routine-ex-card__right">
        {editing ? (
          <div className="routine-ex-card__edit">
            <label>
              Series
              <input
                type="number"
                min="1" max="10"
                value={form.target_sets}
                onChange={e => setForm(f => ({ ...f, target_sets: e.target.value }))}
              />
            </label>
            <label>
              Reps
              <input
                type="number"
                min="1" max="100"
                value={form.target_reps}
                onChange={e => setForm(f => ({ ...f, target_reps: e.target.value }))}
              />
            </label>
            <label>
              Descanso (s)
              <input
                type="number"
                min="0" max="600" step="15"
                value={form.rest_seconds}
                onChange={e => setForm(f => ({ ...f, rest_seconds: e.target.value }))}
              />
            </label>
            <div className="routine-ex-card__edit-actions">
              <button onClick={handleSave} disabled={saving} type="button" className="routine-ex-card__btn routine-ex-card__btn--save">
                {saving ? '...' : '✓'}
              </button>
              <button onClick={() => setEditing(false)} type="button" className="routine-ex-card__btn routine-ex-card__btn--cancel">
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="routine-ex-card__stats">
            <span className="routine-ex-card__stat">{target_sets} × {target_reps}</span>
            <span className="routine-ex-card__rest">{rest_seconds}s</span>
            <button onClick={() => setEditing(true)} type="button" className="routine-ex-card__btn routine-ex-card__btn--edit">✏️</button>
            <button onClick={handleRemove} type="button" className="routine-ex-card__btn routine-ex-card__btn--remove">🗑️</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoutineExerciseCard
