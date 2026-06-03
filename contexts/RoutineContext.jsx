import { createContext, useContext, useState, useCallback } from 'react'
import { getActiveRoutine } from '../js/routines/routines.api'

const RoutineContext = createContext(null)

export const RoutineProvider = ({ children }) => {
  const [routine, setRoutine] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchActiveRoutine = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const res = await getActiveRoutine(token)
      setRoutine(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  const clearRoutine = useCallback(() => setRoutine(null), [])

  return (
    <RoutineContext.Provider value={{ routine, setRoutine, loading, error, fetchActiveRoutine, clearRoutine }}>
      {children}
    </RoutineContext.Provider>
  )
}

export const useRoutineContext = () => {
  const ctx = useContext(RoutineContext)
  if (!ctx) throw new Error('useRoutineContext debe usarse dentro de RoutineProvider')
  return ctx
}
