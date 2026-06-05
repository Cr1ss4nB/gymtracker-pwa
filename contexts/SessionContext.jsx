import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import {
  getActiveSession,
  startSession as apiStart,
  finishSession as apiFinish,
  cancelSession as apiCancel,
  addLog as apiAddLog
} from '../js/sessions/sessions.api'

const SS_KEY = 'gymtracker_active_session'
const SessionContext = createContext(null)

export const SessionProvider = ({ children }) => {
  const [session,        setSession]        = useState(null)
  const [lastCompleted,  setLastCompleted]  = useState(null)
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState('')
  const [elapsed,        setElapsed]        = useState(0)
  const timerRef = useRef(null)

  const persistSession = useCallback((s) => {
    if (s) sessionStorage.setItem(SS_KEY, JSON.stringify(s))
    else   sessionStorage.removeItem(SS_KEY)
  }, [])

  // PATRÓN CORRECTO para StrictMode:
  //  - El interval vive dentro de este effect, no en callbacks.
  //  - El cleanup de StrictMode lo limpia → re-monta → lo re-arranca limpiamente.
  //  - No hay funciones startTimer/stopTimer separadas que compitan.

  useEffect(() => {
    if (!session || session.status !== 'IN_PROGRESS' || !session.started_at) {
      // Sin sesión activa: limpiar interval y resetear elapsed
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setElapsed(0)
      return
    }

    const origin = Date.parse(session.started_at)
    if (isNaN(origin)) return

    setElapsed(Math.max(0, Math.round((Date.now() - origin) / 1000)))

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setElapsed(Math.max(0, Math.round((Date.now() - origin) / 1000)))
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [session])

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await getActiveSession()
        if (res.data) {
          setSession(res.data)
          persistSession(res.data)
        } else {
          setSession(null)
          persistSession(null)
        }
      } catch {
        const cached = sessionStorage.getItem(SS_KEY)
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            if (parsed?.status === 'IN_PROGRESS' && parsed?.started_at) {
              setSession(parsed)
            }
          } catch { /* JSON inválido */ }
        }
      }
    }

    restore()
  }, [])

  const startSession = useCallback(async (routineId = null) => {
    setLoading(true)
    setError('')
    try {
      const res = await apiStart(routineId)
      const newSession = { ...res.data, logs: [] }
      setSession(newSession)      
      setLastCompleted(null)
      persistSession(newSession)
      return newSession
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [persistSession])

  const finishSession = useCallback(async () => {
    if (!session) return
    setLoading(true)
    setError('')
    try {
      const res = await apiFinish(session.id)
      setLastCompleted({ ...res.data, logs: session.logs || [] })
      setSession(null)          
      persistSession(null)
      return res.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, persistSession])

  const cancelSession = useCallback(async () => {
    if (!session) return
    setLoading(true)
    setError('')
    try {
      const res = await apiCancel(session.id)
      setSession(null)          
      setLastCompleted(null)
      persistSession(null)
      return res.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, persistSession])

  const addLog = useCallback(async (logData) => {
    if (!session) throw new Error('No hay sesión activa')
    setError('')
    try {
      const res = await apiAddLog(session.id, logData)
      const newLog = res.data
      setSession(prev => {
        if (!prev) return prev
        const updated = { ...prev, logs: [...(prev.logs || []), newLog] }
        persistSession(updated)
        return updated
      })
      return newLog
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [session, persistSession])

  const refreshSession = useCallback(async () => {
    if (!session?.id) return
    try {
      const res = await getActiveSession()
      if (res.data) {
        setSession(res.data)
        persistSession(res.data)
      } else {
        setSession(null)
        persistSession(null)
      }
    } catch { /* silencioso */ }
  }, [session, persistSession])

  const isActive = session?.status === 'IN_PROGRESS'

  return (
    <SessionContext.Provider value={{
      session,
      lastCompleted,
      isActive,
      loading,
      error,
      elapsed,
      startSession,
      finishSession,
      cancelSession,
      addLog,
      refreshSession
    }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSessionContext = () => {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSessionContext debe usarse dentro de SessionProvider')
  return ctx
}
