import { useCallback } from 'react'
import { useSessionContext } from '../contexts/SessionContext'
import { useRoutineContext } from '../contexts/RoutineContext'

export const useSession = () => {
  const {
    session,
    lastCompleted,
    isActive,
    loading,
    error,
    elapsed,
    startSession: ctxStart,
    finishSession,
    cancelSession,
    addLog,
    refreshSession
  } = useSessionContext()

  const { routine } = useRoutineContext()

  const startWithActiveRoutine = useCallback(async () => {
    const routineId = routine?.id || null
    return ctxStart(routineId)
  }, [routine, ctxStart])

  const getTodayDayNumber = () => {
    const jsDay = new Date().getDay()
    return jsDay === 0 ? 7 : jsDay
  }

  const todayExercises = (() => {
    if (!routine?.exercises_by_day) return []
    const dayNum = getTodayDayNumber()
    return routine.exercises_by_day[dayNum] || []
  })()

  const formatElapsed = (seconds) => {
    const s = Math.max(0, seconds)
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const ss = (s % 60).toString().padStart(2, '0')
    return `${m}:${ss}`
  }

  const logExercise = useCallback(async ({
    exerciseId, performedSets, performedReps, performedWeightKg, notes
  }) => {
    return addLog({
      exercise_id: exerciseId,
      performed_sets: performedSets,
      performed_reps: performedReps,
      performed_weight_kg: performedWeightKg,
      notes
    })
  }, [addLog])

  const isExerciseLogged = useCallback((exerciseId) => {
    if (!session?.logs) return false
    return session.logs.some(log => log.exercise_id === exerciseId)
  }, [session])

  const sessionStats = (() => {
    if (isActive && session?.logs) {
      const logs = session.logs
      const totalLogs = logs.length
      const totalVolume = logs.reduce((acc, log) => {
        return acc + ((log.performed_sets || 0) * (log.performed_reps || 0) * (log.performed_weight_kg || 0))
      }, 0)
      return { totalLogs, totalVolume: Math.round(totalVolume) }
    }

    if (todayExercises.length > 0) {
      const totalLogs = todayExercises.length
      const totalVolume = todayExercises.reduce((acc, re) => {
        return acc + (re.target_weight_kg || 0)
      }, 0)
      return { totalLogs, totalVolume: Math.round(totalVolume) }
    }

    return { totalLogs: 0, totalVolume: 0 }
  })()

  return {
    session,
    lastCompleted,
    isActive,
    loading,
    error,
    elapsed,
    elapsedFormatted: formatElapsed(elapsed),

    routine,
    todayExercises,

    startWithActiveRoutine,
    startSession: ctxStart,
    finishSession,
    cancelSession,
    logExercise,
    refreshSession,

    isExerciseLogged,
    sessionStats,
    getTodayDayNumber
  }
}
