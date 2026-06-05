import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import {
  getActiveSession,
  startSession as apiStart,
  finishSession as apiFinish,
  cancelSession as apiCancel,
  addLog as apiAddLog
} from '../js/sessions/sessions.api'
import { idbPut } from '../js/lib/indexeddb.js'

const SS_KEY = 'gymtracker_active_session'
const SessionContext = createContext(null)

// ── Geolocalización ───────────────────────────────────────────
const getCurrentPosition = () =>
  new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      console.warn('[Geo] Geolocalización no soportada en este dispositivo')
      return resolve(null)
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: Math.round(pos.coords.accuracy)
      }),
      (err) => {
        console.warn('[Geo] Permiso denegado o error:', err.message)
        resolve(null)
      },
      { timeout: 8000, maximumAge: 60000, enableHighAccuracy: true }
    )
  })

// Determina si las coordenadas corresponden a gym, casa u otro
const classifyLocation = (lat, lng, gymCoords, homeCoords, radiusMeters = 200) => {
  const distanceTo = (target) => {
    const R = 6371000
    const dLat = (target.lat - lat) * Math.PI / 180
    const dLng = (target.lng - lng) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat * Math.PI / 180) *
      Math.cos(target.lat * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  if (gymCoords && distanceTo(gymCoords) <= radiusMeters) return 'gym'
  if (homeCoords && distanceTo(homeCoords) <= radiusMeters) return 'home'
  return 'other'
}

// Guardar en IndexedDB para historial local (sin servidor)
const saveLocationLocally = async (event, position, label) => {
  try {
    await idbPut('location_history', {
      event,
      label,
      lat: position.lat,
      lng: position.lng,
      accuracy: position.accuracy,
      timestamp: new Date().toISOString()
    })
    console.log(`[Geo] Ubicación guardada localmente — ${label}`)
  } catch (err) {
    console.warn('[Geo] No se pudo guardar en IndexedDB:', err.message)
  }
}

// ── Provider ──────────────────────────────────────────────────
export const SessionProvider = ({ children }) => {
  const [session,         setSession]         = useState(null)
  const [lastCompleted,   setLastCompleted]   = useState(null)
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState('')
  const [elapsed,         setElapsed]         = useState(0)
  const [locationInfo,    setLocationInfo]    = useState(null)
  // locationInfo = { lat, lng, accuracy, label: 'gym'|'home'|'other', status: 'ok'|'denied'|'unsupported' }

  const timerRef = useRef(null)

  const persistSession = useCallback((s) => {
    if (s) sessionStorage.setItem(SS_KEY, JSON.stringify(s))
    else   sessionStorage.removeItem(SS_KEY)
  }, [])

  // Timer
  useEffect(() => {
    if (!session || session.status !== 'IN_PROGRESS' || !session.started_at) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
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
    return () => { clearInterval(timerRef.current); timerRef.current = null }
  }, [session])

  // Restaurar sesión activa al cargar
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        const res = await getActiveSession()
        if (res.data) { setSession(res.data); persistSession(res.data) }
        else { setSession(null); persistSession(null) }
      } catch {
        const cached = sessionStorage.getItem(SS_KEY)
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            if (parsed?.status === 'IN_PROGRESS' && parsed?.started_at) setSession(parsed)
          } catch { /* JSON inválido */ }
        }
      }
    }
    restore()
  }, [])

  // ── startSession con geolocalización ─────────────────────────
  const startSession = useCallback(async (routineId = null) => {
    setLoading(true)
    setError('')
    try {
      const res = await apiStart(routineId)
      const newSession = { ...res.data, logs: [] }
      setSession(newSession)
      setLastCompleted(null)
      persistSession(newSession)

      // Geolocalización en paralelo — no bloquea el inicio
      getCurrentPosition().then(async (pos) => {
        if (!pos) {
          setLocationInfo({ status: 'denied' })
          return
        }

        // Coordenadas del gym/casa guardadas en localStorage por el usuario
        // Si no las tiene configuradas, solo mostramos las coordenadas
        const gymCoords  = JSON.parse(localStorage.getItem('gym_coords')  || 'null')
        const homeCoords = JSON.parse(localStorage.getItem('home_coords') || 'null')

        const label = classifyLocation(pos.lat, pos.lng, gymCoords, homeCoords)
        const info = { ...pos, label, status: 'ok' }

        setLocationInfo(info)
        console.log(`[Geo] Ubicación al iniciar: ${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)} (±${pos.accuracy}m) → ${label}`)

        // Guardar en IndexedDB para historial local
        await saveLocationLocally('start', pos, label)
      })

      return newSession
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [persistSession])

  // ── finishSession con geolocalización ────────────────────────
  const finishSession = useCallback(async () => {
    if (!session) return
    setLoading(true)
    setError('')
    try {
      // Registrar ubicación de fin
      getCurrentPosition().then(async (pos) => {
        if (pos) {
          const gymCoords  = JSON.parse(localStorage.getItem('gym_coords')  || 'null')
          const homeCoords = JSON.parse(localStorage.getItem('home_coords') || 'null')
          const label = classifyLocation(pos.lat, pos.lng, gymCoords, homeCoords)
          console.log(`[Geo] Ubicación al finalizar: ${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)} → ${label}`)
          await saveLocationLocally('finish', pos, label)
        }
      })

      const res = await apiFinish(session.id)
      setLastCompleted({ ...res.data, logs: session.logs || [] })
      setSession(null)
      setLocationInfo(null)
      persistSession(null)
      return res.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, persistSession])

  // ── cancelSession ────────────────────────────────────────────
  const cancelSession = useCallback(async () => {
    if (!session) return
    setLoading(true)
    setError('')
    try {
      const res = await apiCancel(session.id)
      setSession(null)
      setLastCompleted(null)
      setLocationInfo(null)
      persistSession(null)
      return res.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, persistSession])

  // ── addLog ───────────────────────────────────────────────────
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

  // ── refreshSession ───────────────────────────────────────────
  const refreshSession = useCallback(async () => {
    if (!session?.id) return
    try {
      const res = await getActiveSession()
      if (res.data) { setSession(res.data); persistSession(res.data) }
      else { setSession(null); persistSession(null) }
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
      locationInfo,
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