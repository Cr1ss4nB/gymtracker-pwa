import { createContext, useContext, useState, useCallback } from 'react'
import { getActiveRoutine } from '../js/routines/routines.api'
import { idbPut, idbGetByIndex } from '../js/lib/indexeddb.js'

const RoutineContext = createContext(null)

export const RoutineProvider = ({ children }) => {
  const [routine, setRoutine] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  const cacheRoutine = useCallback(async (routineData) => {
    if (!routineData) return
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      await idbPut('routines', {
        ...routineData,
        user_id: user.id,
        cached_at: new Date().toISOString()
      })
    } catch (err) {
      console.warn('[Rutinas] Error guardando en caché:', err)
    }
  }, [])

  const fetchActiveRoutine = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const res = await getActiveRoutine()
      setRoutine(res.data)
      setIsOffline(false)
      await cacheRoutine(res.data)
    } catch (err) {
      // Sin internet — cargar desde IndexedDB
      console.warn('[Rutinas] Sin conexión, cargando desde caché local')
      setIsOffline(true)
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const cached = await idbGetByIndex('routines', 'by_user', user.id)
        const active = cached.find(r => r.is_active)
        if (active) {
          setRoutine(active)
        } else {
          setError('Sin conexión y sin datos en caché')
        }
      } catch (idbErr) {
        setError('No se pudo cargar la rutina')
      }
    } finally {
      setLoading(false)
    }
  }, [cacheRoutine])

  const clearRoutine = useCallback(() => setRoutine(null), [])

  return (
    <RoutineContext.Provider value={{
      routine, setRoutine, loading, error,
      isOffline, fetchActiveRoutine, clearRoutine, cacheRoutine
    }}>
      {children}
    </RoutineContext.Provider>
  )
}

export const useRoutineContext = () => {
  const ctx = useContext(RoutineContext)
  if (!ctx) throw new Error('useRoutineContext debe usarse dentro de RoutineProvider')
  return ctx
}