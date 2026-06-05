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
import { queueOperation } from '../js/lib/syncManager.js'

export const useRoutine = () => {
  const { routine, setRoutine, loading, error, isOffline, fetchActiveRoutine, clearRoutine, cacheRoutine } = useRoutineContext()
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const [offlineMsg, setOfflineMsg] = useState('')

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

  const showOfflineMsg = useCallback((msg) => {
    setOfflineMsg(msg)
    setTimeout(() => setOfflineMsg(''), 4000)
  }, [])

  // ─── HELPERS OFFLINE ───────────────────────────────────────

  const saveExerciseLocally = useCallback(async (exerciseData, dayNumber) => {
    const tempId = `temp_${Date.now()}`
    const tempExercise = { id: tempId, ...exerciseData, _pending: true }

    setRoutine(prev => {
      if (!prev) return prev
      const byDay = { ...prev.exercises_by_day }
      byDay[dayNumber] = [...(byDay[dayNumber] || []), tempExercise]
      const updated = { ...prev, exercises_by_day: byDay }
      cacheRoutine(updated)
      return updated
    })

    await queueOperation('add_exercise', { routineId: routine.id, ...exerciseData })
    showOfflineMsg('Ejercicio guardado localmente. Se sincronizará cuando vuelva la conexión.')
    return tempExercise
  }, [routine, setRoutine, cacheRoutine, showOfflineMsg])

  const updateExerciseLocally = useCallback(async (routineExerciseId, updates) => {
    setRoutine(prev => {
      if (!prev) return prev
      const byDay = { ...prev.exercises_by_day }
      for (const day in byDay) {
        byDay[day] = byDay[day].map(ex =>
          ex.id === routineExerciseId ? { ...ex, ...updates, _pending: true } : ex
        )
      }
      const updated = { ...prev, exercises_by_day: byDay }
      cacheRoutine(updated)
      return updated
    })

    await queueOperation('update_exercise', { routineExerciseId, ...updates })
    showOfflineMsg('Cambios guardados localmente. Se sincronizarán cuando vuelva la conexión.')
    return { id: routineExerciseId, ...updates }
  }, [setRoutine, cacheRoutine, showOfflineMsg])

  const removeExerciseLocally = useCallback(async (routineExerciseId, dayNumber) => {
    setRoutine(prev => {
      if (!prev) return prev
      const byDay = { ...prev.exercises_by_day }
      byDay[dayNumber] = (byDay[dayNumber] || []).filter(ex => ex.id !== routineExerciseId)
      const updated = { ...prev, exercises_by_day: byDay }
      cacheRoutine(updated)
      return updated
    })

    await queueOperation('remove_exercise', { routineExerciseId })
    showOfflineMsg('Ejercicio eliminado localmente. Se sincronizará cuando vuelva la conexión.')
  }, [setRoutine, cacheRoutine, showOfflineMsg])

  // ─── HANDLERS ──────────────────────────────────────────────

  const handleAddExercise = useCallback(async (exerciseId, dayNumber, opts = {}) => {
    return handleAction(async () => {
      const exerciseData = {
        exercise_id: exerciseId,
        day_number: dayNumber,
        target_sets: opts.target_sets || 3,
        target_reps: opts.target_reps || 10,
        rest_seconds: opts.rest_seconds || 90,
        target_weight_kg: opts.target_weight_kg || 0
      }

      if (!navigator.onLine) {
        return await saveExerciseLocally(exerciseData, dayNumber)
      }

      try {
        const res = await addExercise(routine.id, exerciseData)
        setRoutine(prev => {
          if (!prev) return prev
          const byDay = { ...prev.exercises_by_day }
          byDay[dayNumber] = [...(byDay[dayNumber] || []), res.data]
          const updated = { ...prev, exercises_by_day: byDay }
          cacheRoutine(updated)
          return updated
        })
        return res.data
      } catch {
        console.warn('[Offline] Red no disponible, guardando ejercicio localmente')
        return await saveExerciseLocally(exerciseData, dayNumber)
      }
    })
  }, [routine, handleAction, setRoutine, cacheRoutine, saveExerciseLocally])

  const handleUpdateExercise = useCallback(async (routineExerciseId, updates) => {
    return handleAction(async () => {
      if (!navigator.onLine) {
        return await updateExerciseLocally(routineExerciseId, updates)
      }

      try {
        const res = await updateExercise(routineExerciseId, updates)
        setRoutine(prev => {
          if (!prev) return prev
          const byDay = { ...prev.exercises_by_day }
          for (const day in byDay) {
            byDay[day] = byDay[day].map(ex =>
              ex.id === routineExerciseId ? res.data : ex
            )
          }
          const updated = { ...prev, exercises_by_day: byDay }
          cacheRoutine(updated)
          return updated
        })
        return res.data
      } catch {
        console.warn('[Offline] Red no disponible, guardando cambio localmente')
        return await updateExerciseLocally(routineExerciseId, updates)
      }
    })
  }, [handleAction, setRoutine, cacheRoutine, updateExerciseLocally])

  const handleRemoveExercise = useCallback(async (routineExerciseId, dayNumber) => {
    return handleAction(async () => {
      if (!navigator.onLine) {
        return await removeExerciseLocally(routineExerciseId, dayNumber)
      }

      try {
        await removeExercise(routineExerciseId)
        setRoutine(prev => {
          if (!prev) return prev
          const byDay = { ...prev.exercises_by_day }
          byDay[dayNumber] = (byDay[dayNumber] || []).filter(ex => ex.id !== routineExerciseId)
          const updated = { ...prev, exercises_by_day: byDay }
          cacheRoutine(updated)
          return updated
        })
      } catch {
        console.warn('[Offline] Red no disponible, eliminando ejercicio localmente')
        return await removeExerciseLocally(routineExerciseId, dayNumber)
      }
    })
  }, [handleAction, setRoutine, cacheRoutine, removeExerciseLocally])

  const handleDeleteRoutine = useCallback(async () => {
    if (!routine) return
    if (!navigator.onLine) {
      setActionError('No puedes eliminar una rutina sin conexión.')
      return
    }
    return handleAction(async () => {
      await deleteRoutine(routine.id)
      clearRoutine()
    })
  }, [routine, handleAction, clearRoutine])

  const handleCreateManual = useCallback(async (name) => {
    if (!navigator.onLine) {
      setActionError('Necesitas conexión para crear una rutina.')
      return
    }
    return handleAction(async () => {
      const created = await createRoutine({ name })
      const activated = await activateRoutine(created.data.id)
      const byDay = {}
      for (let d = 1; d <= 7; d++) byDay[d] = []
      const newRoutine = { ...activated.data, exercises_by_day: byDay }
      setRoutine(newRoutine)
      await cacheRoutine(newRoutine)
      return newRoutine
    })
  }, [handleAction, setRoutine, cacheRoutine])

  return {
    routine,
    loading,
    error,
    isOffline,
    offlineMsg,
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