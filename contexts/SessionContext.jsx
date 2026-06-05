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
  const [session, setSession]           = useState(null)
  const [lastCompleted, setLastCompleted] = useState(null) 
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [elapsed, setElapsed]           = useState(0)
  const timerRef                        = useRef(null)
  const restoredRef                     = useRef(false)    

  // Persistencia sessionStorage

  const persistSession = useCallback((s) => {
    if (s) sessionStorage.setItem(SS_KEY, JSON.stringify(s))
    else   sessionStorage.removeItem(SS_KEY)
  }, [])

  const startTimer = useCallback((startedAt) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    const origin = Date.parse(startedAt) 
    if (isNaN(origin)) return           

    setElapsed(Math.max(0, Math.round((Date.now() - origin) / 1000)))

    timerRef.current = setInterval(() => {
      const secs = Math.round((Date.now() - origin) / 1000)
      setElapsed(Math.max(0, secs))  
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setElapsed(0)
  }, [])

  // Restauración al montar

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await getActiveSession()
        if (res.data) {
          setSession(res.data)
          persistSession(res.data)
          startTimer(res.data.started_at)
        } else {
          setSession(null)
          persistSession(null)
          stopTimer()
        }
      } catch {
        const cached = sessionStorage.getItem(SS_KEY)
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            if (parsed?.status === 'IN_PROGRESS' && parsed?.started_at) {
              setSession(parsed)
              startTimer(parsed.started_at)
            }
          } catch { /* ignorar JSON inválido */ }
        }
      }

      restoredRef.current = true
    }

    restore()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Iniciar sesión

  const startSession = useCallback(async (routineId = null) => {
    setLoading(true)
    setError('')
    try {
      const res = await apiStart(routineId)
      const newSession = { ...res.data, logs: [] }
      setSession(newSession)
      setLastCompleted(null)     
      persistSession(newSession)
      startTimer(newSession.started_at)
      return newSession
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [persistSession, startTimer])

  // Terminar sesión 

  const finishSession = useCallback(async () => {
    if (!session) return
    setLoading(true)
    setError('')
    try {
      const res = await apiFinish(session.id)
      stopTimer()
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
  }, [session, persistSession, stopTimer])

  // Cancelar sesión

  const cancelSession = useCallback(async () => {
    if (!session) return
    setLoading(true)
    setError('')
    try {
      const res = await apiCancel(session.id)
      stopTimer()
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
  }, [session, persistSession, stopTimer])

  // Registrar log

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

  // Refresh desde backend

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
        stopTimer()
      }
    } catch { /* silencioso */ }
  }, [session, persistSession, stopTimer])

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
