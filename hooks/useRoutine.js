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

  // Carga la rutina activa al montar el componente que use el hook
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

  // Agregar ejercicio
  const handleAddExercise = useCallback(async (exerciseId, dayNumber, opts = {}) => {
    return handleAction(async () => {
      const res = await addExercise(token, routine.id, {
        exercise_id: exerciseId,
        day_number: dayNumber,
        target_sets: opts.target_sets || 3,
        target_reps: opts.target_reps || 10,
        rest_seconds: opts.rest_seconds || 90
      })

      // Actualizar estado local sin refetch
      setRoutine(prev => {
        if (!prev) return prev
        const byDay = { ...prev.exercises_by_day }
        byDay[dayNumber] = [...(byDay[dayNumber] || []), res.data]
        return { ...prev, exercises_by_day: byDay }
      })
      return res.data
    })
  }, [token, routine, handleAction, setRoutine])

  // Actualizar series/reps
  const handleUpdateExercise = useCallback(async (routineExerciseId, updates) => {
    return handleAction(async () => {
      const res = await updateExercise(token, routineExerciseId, updates)

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
  }, [token, handleAction, setRoutine])

  // Eliminar ejercicio
  const handleRemoveExercise = useCallback(async (routineExerciseId, dayNumber) => {
    return handleAction(async () => {
      await removeExercise(token, routineExerciseId)

      setRoutine(prev => {
        if (!prev) return prev
        const byDay = { ...prev.exercises_by_day }
        byDay[dayNumber] = (byDay[dayNumber] || []).filter(ex => ex.id !== routineExerciseId)
        return { ...prev, exercises_by_day: byDay }
      })
    })
  }, [token, handleAction, setRoutine])

  // Eliminar rutina completa
  const handleDeleteRoutine = useCallback(async () => {
    if (!routine) return
    return handleAction(async () => {
      await deleteRoutine(token, routine.id)
      clearRoutine()
    })
  }, [token, routine, handleAction, clearRoutine])

  // Crear rutina manual y activarla
  const handleCreateManual = useCallback(async (name) => {
    return handleAction(async () => {
      const created = await createRoutine(token, { name })
      const activated = await activateRoutine(token, created.data.id)
      const byDay = {}
      for (let d = 1; d <= 7; d++) byDay[d] = []
      const newRoutine = { ...activated.data, exercises_by_day: byDay }
      setRoutine(newRoutine)
      return newRoutine
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
