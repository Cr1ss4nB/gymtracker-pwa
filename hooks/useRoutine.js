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

  useEffect(() => {
    fetchActiveRoutine()
  }, [fetchActiveRoutine])

  const handleAction = useCallback(async (fn) => {
    setActionLoading(true)
    setActionError('')
    try {
      return await fn()
    } catch (err) {
      setActionError(err.message || 'Error inesperado')
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [])

  const handleAddExercise = useCallback(async (exerciseId, dayNumber, opts = {}) => {
    return handleAction(async () => {
      const res = await addExercise(routine.id, {
        exercise_id: exerciseId,
        day_number: dayNumber,
        target_sets: opts.target_sets || 3,
        target_reps: opts.target_reps || 10,
        rest_seconds: opts.rest_seconds || 90,
        target_weight_kg: opts.target_weight_kg || 0
      })

      setRoutine(prev => {
        if (!prev) return prev
        const byDay = { ...prev.exercises_by_day }
        byDay[dayNumber] = [...(byDay[dayNumber] || []), res.data]
        return { ...prev, exercises_by_day: byDay }
      })
      return res.data
    })
  }, [routine, handleAction, setRoutine])

  const handleUpdateExercise = useCallback(async (routineExerciseId, updates) => {
    return handleAction(async () => {
      const res = await updateExercise(routineExerciseId, updates)

      setRoutine(prev => {
        if (!prev) return prev
        const byDay = { ...prev.exercises_by_day }
        for (const day in byDay) {
          byDay[day] = byDay[day].map(ex =>
            ex.id === routineExerciseId ? res.data : ex
          )
        }
        return { ...prev, exercises_by_day: byDay }
      })
      return res.data
    })
  }, [handleAction, setRoutine])

  const handleRemoveExercise = useCallback(async (routineExerciseId, dayNumber) => {
    return handleAction(async () => {
      await removeExercise(routineExerciseId)

      setRoutine(prev => {
        if (!prev) return prev
        const byDay = { ...prev.exercises_by_day }
        byDay[dayNumber] = (byDay[dayNumber] || []).filter(ex => ex.id !== routineExerciseId)
        return { ...prev, exercises_by_day: byDay }
      })
    })
  }, [handleAction, setRoutine])

  const handleDeleteRoutine = useCallback(async () => {
    if (!routine) return
    return handleAction(async () => {
      await deleteRoutine(routine.id)
      clearRoutine()
    })
  }, [routine, handleAction, clearRoutine])

  const handleCreateManual = useCallback(async (name) => {
    return handleAction(async () => {
      const created = await createRoutine({ name })
      const activated = await activateRoutine(created.data.id)
      const byDay = {}
      for (let d = 1; d <= 7; d++) byDay[d] = []
      const newRoutine = { ...activated.data, exercises_by_day: byDay }
      setRoutine(newRoutine)
      return newRoutine
    })
  }, [handleAction, setRoutine])

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
