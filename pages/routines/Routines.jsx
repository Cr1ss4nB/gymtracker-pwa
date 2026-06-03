import { useState } from 'react'
import { useRoutine } from '../../hooks/useRoutine'
import RoutineDayColumn from '../../components/RoutineDayColumn'
import EmptyRoutineState from '../../components/EmptyRoutineState'
import TemplateSelector from '../../components/TemplateSelector'
import ExercisePicker from '../../components/ExercisePicker'
import ConfirmDialog from '../../components/ConfirmDialog'
import './routines.css'

// Modal de creación manual
const CreateManualModal = ({ onConfirm, onClose, loading }) => {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onConfirm(name.trim())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box--sm" onClick={e => e.stopPropagation()}>
        <div className="modal-box__header">
          <h2 className="modal-box__title">Nueva rutina</h2>
          <button className="modal-box__close" onClick={onClose} type="button">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-box__form">
          <div className="modal-box__field">
            <label>Nombre de la rutina</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Mi rutina de fuerza"
              required
              autoFocus
            />
            <span className="modal-box__field-hint">
              Podrás agregar ejercicios a cada día desde el tablero.
            </span>
          </div>
          <div className="modal-box__footer">
            <button
              type="button"
              className="modal-box__btn modal-box__btn--cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="modal-box__btn modal-box__btn--primary"
              disabled={!name.trim() || loading}
            >
              {loading ? 'Creando...' : 'Crear rutina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Componente principal
const Routines = () => {
  const token = localStorage.getItem('token')

  const {
    routine,
    loading,
    error,
    actionLoading,
    actionError,
    fetchActiveRoutine,
    handleAddExercise,
    handleUpdateExercise,
    handleRemoveExercise,
    handleDeleteRoutine,
    handleCreateManual
  } = useRoutine()

  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showCreateManual, setShowCreateManual] = useState(false)
  const [showExercisePicker, setShowExercisePicker] = useState(false)
  const [pickerDay, setPickerDay] = useState(1)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleTemplateSelected = () => {
    setShowTemplateSelector(false)
    fetchActiveRoutine()
  }

  const handleManualCreate = async (name) => {
    try {
      await handleCreateManual(name)
      setShowCreateManual(false)
    } catch {
      // actionError ya está en el hook
    }
  }

  const handleOpenPicker = (dayNumber) => {
    setPickerDay(dayNumber)
    setShowExercisePicker(true)
  }

  const handlePickerAdd = async (exerciseId, dayNumber) => {
    await handleAddExercise(exerciseId, dayNumber)
  }

  const handleConfirmDelete = async () => {
    await handleDeleteRoutine()
    setShowDeleteConfirm(false)
  }

  // Días activos: derivados de routine_exercises
  // Siempre mostramos los 7 días para máxima flexibilidad.
  // Los días sin ejercicios aparecen como "Descanso".
  const allDays = [1, 2, 3, 4, 5, 6, 7]

  // Loading
  if (loading) {
    return (
      <div className="routines-page">
        <div className="routines-loading">
          <div className="routines-loading__spinner" />
          <span>Cargando rutina...</span>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="routines-page">
        <div className="routines-error">
          <span>⚠️ {error}</span>
          <button onClick={fetchActiveRoutine} type="button">Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="routines-page">
      {/* Header */}
      <div className="routines-header">
        <div>
          <h1 className="routines-title">Rutinas</h1>
          {routine && (
            <p className="routines-subtitle">{routine.name}</p>
          )}
        </div>
        {routine && (
          <div className="routines-header__actions">
            <button
              className="routines-btn routines-btn--danger"
              onClick={() => setShowDeleteConfirm(true)}
              type="button"
              disabled={actionLoading}
            >
              Eliminar rutina
            </button>
          </div>
        )}
      </div>

      {actionError && (
        <div className="routines-action-error">⚠️ {actionError}</div>
      )}

      {/* Sin rutina activa */}
      {!routine ? (
        <EmptyRoutineState
          onUseTemplate={() => setShowTemplateSelector(true)}
          onCreateManual={() => setShowCreateManual(true)}
        />
      ) : (
        /* Tablero semanal — 7 columnas siempre visibles */
        <div className="routines-board">
          {allDays.map(day => (
            <RoutineDayColumn
              key={day}
              dayNumber={day}
              exercises={routine.exercises_by_day?.[day] || []}
              onAddExercise={handleOpenPicker}
              onUpdateExercise={handleUpdateExercise}
              onRemoveExercise={handleRemoveExercise}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      {showTemplateSelector && (
        <TemplateSelector
          token={token}
          onSelect={handleTemplateSelected}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {showCreateManual && (
        <CreateManualModal
          loading={actionLoading}
          onConfirm={handleManualCreate}
          onClose={() => setShowCreateManual(false)}
        />
      )}

      {showExercisePicker && (
        <ExercisePicker
          token={token}
          defaultDay={pickerDay}
          onAdd={handlePickerAdd}
          onClose={() => setShowExercisePicker(false)}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="¿Eliminar rutina?"
        message="Se eliminarán todos los ejercicios de esta rutina. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}

export default Routines
