import { useEffect, useState } from 'react'
import { useRoutineContext } from '../../contexts/RoutineContext'
import { useSession } from '../../hooks/useSession'
import { getWeeklySessions } from '../../js/sessions/sessions.api'
import { updateProfile } from '../../js/profile/profile.api'
import '../dashboard/dashboard.css'

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const today = new Date()
const nombreDia = DAYS_ES[today.getDay()]
const fechaStr = today.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })

const isProfileComplete = (userData) =>
  userData &&
  userData.age != null && userData.age > 0 &&
  userData.height != null && userData.height > 0 &&
  userData.weight != null && userData.weight > 0

const Dashboard = () => {
  const token = localStorage.getItem('token')
  const [user, setUser] = useState({})

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [formData, setFormData] = useState({ dateOfBirth: '', height: '', weight: '' })

  // Rutina
  const { routine } = useRoutineContext()

  // Sesión
  const {
    isActive,
    elapsed,
    elapsedFormatted,
    session,
    todayExercises,
    sessionStats,
    startWithActiveRoutine,
    finishSession,
    cancelSession,
    loading: sessionLoading,
    error: sessionError
  } = useSession()

  const [weeklySessions, setWeeklySessions] = useState([])
  const [weeklyLoading, setWeeklyLoading] = useState(true)

  const activeDaysCount = routine?.active_days_count ?? routine?.active_days?.length ?? 0

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(userData)
    if (!isProfileComplete(userData)) setShowProfileModal(true)
  }, [])

  useEffect(() => {
    if (!token) return
    const loadWeekly = async () => {
      setWeeklyLoading(true)
      try {
        const res = await getWeeklySessions()
        setWeeklySessions(res.data || [])
      } catch {
      } finally {
        setWeeklyLoading(false)
      }
    }
    loadWeekly()
  }, [isActive])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileLoading(true)
    try {
      const updated = await updateProfile(token, formData)
      const updatedUser = { ...user, age: updated.age, height: updated.height, weight: updated.weight, imc: updated.imc }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setShowProfileModal(false)
    } catch (err) {
      setProfileError(err.message)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleStartSession = async () => {
    try {
      await startWithActiveRoutine()
    } catch { /* sessionError visible */ }
  }

  const handleFinishSession = async () => {
    try {
      await finishSession()
      // Refrescar contador semanal
      const res = await getWeeklySessions()
      setWeeklySessions(res.data || [])
    } catch { /* sessionError visible */ }
  }

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  const monday = (() => {
    const d = new Date()
    const day = d.getDay()
    const diff = day === 0 ? 6 : day - 1
    d.setDate(d.getDate() - diff)
    d.setHours(0, 0, 0, 0)
    return d
  })()

  const weekDaysDone = weekDays.map((_, i) => {
    const dayDate = new Date(monday)
    dayDate.setDate(monday.getDate() + i)
    return weeklySessions.some(s => {
      const sd = new Date(s.started_at)
      return sd.toDateString() === dayDate.toDateString()
    })
  })

  return (
    <>
      {/* Modal onboarding */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Completa tu perfil</h2>
            <p>Necesitamos algunos datos para personalizar tu experiencia</p>
            {profileError && <div className="error-message">{profileError}</div>}
            <form onSubmit={handleProfileSubmit} className="modal-form">
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Altura (cm)</label>
                <input type="number" name="height" value={formData.height} onChange={handleFormChange} placeholder="170" min="140" max="220" required />
              </div>
              <div className="form-group">
                <label>Peso (kg)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleFormChange} placeholder="70" min="30" max="300" required />
              </div>
              <button type="submit" className="modal-btn" disabled={profileLoading}>
                {profileLoading ? 'Guardando...' : 'Completar perfil'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bienvenida */}
      <div className="welcome-card">
        <div>
          <h1 className="welcome-title">Hola {user.name || 'Usuario'}, hoy es {nombreDia}</h1>
          {weeklySessions.length > 0 && (
            <p className="welcome-sub">Llevas {weeklySessions.length} sesión{weeklySessions.length !== 1 ? 'es' : ''} esta semana 💪</p>
          )}
        </div>
        <div className="welcome-date">{fechaStr}</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-valor">
            {weeklyLoading ? '—' : `${weeklySessions.length}/${activeDaysCount || '?'}`}
          </span>
          <span className="stat-label">Sesiones</span>
          <span className="stat-sub">esta semana</span>
        </div>
        <div className="stat-card">
          <span className="stat-valor">{isActive ? elapsedFormatted : '—'}</span>
          <span className="stat-label">Tiempo</span>
          <span className="stat-sub">{isActive ? 'en curso' : 'sin sesión activa'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-valor">{sessionStats.totalLogs}</span>
          <span className="stat-label">Ejercicios</span>
          <span className="stat-sub">{isActive ? 'completados hoy' : 'última sesión'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-valor">{sessionStats.totalVolume > 0 ? `${sessionStats.totalVolume}kg` : '—'}</span>
          <span className="stat-label">Volumen</span>
          <span className="stat-sub">{isActive ? 'esta sesión' : 'última sesión'}</span>
        </div>
      </div>

      {/* Sesión activa / Rutina del día */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            {isActive
              ? `⏱ Sesión en curso — ${elapsedFormatted}`
              : routine
                ? `Rutina activa — ${routine.name}`
                : 'Sin rutina activa'
            }
          </h2>
        </div>

        {sessionError && (
          <div style={{ color: '#ff6b7a', fontSize: '0.875rem', padding: '0.5rem 0' }}>
            ⚠️ {sessionError}
          </div>
        )}

        {/* Ejercicios del día */}
        {todayExercises.length > 0 ? (
          <div className="ejercicios-list">
            {todayExercises.map((re, i) => (
              <div key={re.id || i} className="ejercicio-item">
                <span className="ejercicio-nombre">{re.exercises?.name || 'Ejercicio'}</span>
                <span className="ejercicio-series">
                  {re.target_sets}×{re.target_reps}
                  {re.target_weight_kg > 0 && ` · ${re.target_weight_kg}kg`}
                </span>
              </div>
            ))}
          </div>
        ) : routine ? (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>No hay ejercicios asignados para hoy ({nombreDia}).</p>
        ) : (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Ve a <strong>Rutinas</strong> para crear o activar una rutina.
          </p>
        )}

        {/* Botones de sesión */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {!isActive ? (
            <button
              className="btn-iniciar"
              onClick={handleStartSession}
              disabled={sessionLoading || !routine}
              title={!routine ? 'Activa una rutina primero' : ''}
            >
              {sessionLoading ? 'Iniciando...' : 'Iniciar entrenamiento'}
            </button>
          ) : (
            <>
              <button
                className="btn-iniciar"
                onClick={handleFinishSession}
                disabled={sessionLoading}
                style={{ background: 'linear-gradient(90deg, #28a745, #20c997)' }}
              >
                {sessionLoading ? 'Finalizando...' : 'Finalizar sesión'}
              </button>
              <button
                onClick={cancelSession}
                disabled={sessionLoading}
                style={{
                  background: 'rgba(233,69,96,0.15)',
                  border: '1px solid rgba(233,69,96,0.4)',
                  color: '#e94560',
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progreso semanal */}
      <div className="card">
        <h2 className="card-title">Progreso esta semana</h2>
        <div className="semana-grid">
          {weekDays.map((d, i) => (
            <div key={i} className="dia-item">
              <span className="dia-label">{d}</span>
              <span className={`dia-check ${weekDaysDone[i] ? 'hecho' : ''}`}>
                {weekDaysDone[i] ? '✓' : '○'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Dashboard
