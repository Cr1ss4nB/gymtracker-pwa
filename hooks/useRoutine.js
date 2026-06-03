import { useState, useEffect, useCallback } from 'react'
import { useRoutineContext } from '../contexts/RoutineContext'
import {
  addExercise,
  updateExercise,
  removeExercise,
  deleteRoutine,
  createRoutine,
  activateRoutine
} from '../js/routines/routines.api'

export const useRoutine = () => {
  const { routine, setRoutine, loading, error, fetchActiveRoutine, clearRoutine } = useRoutineContext()
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchActiveRoutine()
  }, [fetchActiveRoutine])

  const handleAction = useCallback(async (fn) => {
    setActionLoading(true)
    setActionError('')
    try {
      const result = await fn()
      return result
    } catch (err) {
      setActionError(err.message)
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [])

  // Agrega ejercicio al día indicado y actualiza el contexto localmente
  const handleAddExercise = useCallback(async (exerciseId, dayNumber, opts = {}) => {
    return handleAction(async () => {
      const res = await addExercise(token, routine.id, {
        exercise_id: exerciseId,
        day_number: dayNumber,
        target_sets: opts.target_sets || 3,
        target_reps: opts.target_reps || 10,
        rest_seconds: opts.rest_seconds || 90
      })

      // Actualizar el estado local sin refetch completo
      setRoutine(prev => {
        if (!prev) return prev
        const updated = { ...prev }
        updated.exercises_by_day = { ...prev.exercises_by_day }
        updated.exercises_by_day[dayNumber] = [
          ...(prev.exercises_by_day[dayNumber] || []),
          res.data
        ]
        return updated
      })
      return res.data
    })
  }, [token, routine, handleAction, setRoutine])

  // Actualiza series/reps de un routine_exercise
  const handleUpdateExercise = useCallback(async (routineExerciseId, updates) => {
    return handleAction(async () => {
      const res = await updateExercise(token, routineExerciseId, updates)

      setRoutine(prev => {
        if (!prev) return prev
        const updated = { ...prev }
        updated.exercises_by_day = { ...prev.exercises_by_day }
        for (const day in updated.exercises_by_day) {
          updated.exercises_by_day[day] = updated.exercises_by_day[day].map(ex =>
            ex.id === routineExerciseId ? res.data : ex
          )
        }
        return updated
      })
      return res.data
    })
  }, [token, handleAction, setRoutine])

  // Elimina ejercicio de la rutina
  const handleRemoveExercise = useCallback(async (routineExerciseId, dayNumber) => {
    return handleAction(async () => {
      await removeExercise(token, routineExerciseId)

      setRoutine(prev => {
        if (!prev) return prev
        const updated = { ...prev }
        updated.exercises_by_day = { ...prev.exercises_by_day }
        updated.exercises_by_day[dayNumber] = (prev.exercises_by_day[dayNumber] || [])
          .filter(ex => ex.id !== routineExerciseId)
        return updated
      })
    })
  }, [token, handleAction, setRoutine])

  // Elimina la rutina completa y limpia el contexto
  const handleDeleteRoutine = useCallback(async () => {
    if (!routine) return
    return handleAction(async () => {
      await deleteRoutine(token, routine.id)
      clearRoutine()
    })
  }, [token, routine, handleAction, clearRoutine])

  // Crea rutina manual vacía y la activa
  const handleCreateManual = useCallback(async (name, daysPerWeek) => {
    return handleAction(async () => {
      const created = await createRoutine(token, { name, days_per_week: daysPerWeek })
      const activated = await activateRoutine(token, created.data.id)
      // Construir exercises_by_day vacío para la nueva rutina
      const byDay = {}
      for (let d = 1; d <= 7; d++) byDay[d] = []
      setRoutine({ ...activated.data, exercises_by_day: byDay })
      return activated.data
    })
  }, [token, handleAction, setRoutine])

  return {
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
  }
}
