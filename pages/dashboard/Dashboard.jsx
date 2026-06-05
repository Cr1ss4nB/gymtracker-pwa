import { useEffect, useState } from 'react'
import { useRoutineContext } from '../../contexts/RoutineContext'
import { useSession } from '../../hooks/useSession'
import { getWeeklySessions } from '../../js/sessions/sessions.api'
import { updateProfile } from '../../js/profile/profile.api'
import '../dashboard/dashboard.css'

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const today     = new Date()
const nombreDia = DAYS_ES[today.getDay()]
const fechaStr  = today.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })

const isProfileComplete = (u) =>
  u && u.age != null && u.age > 0 && u.height != null && u.weight != null

const Dashboard = () => {
  const token = localStorage.getItem('token')
  const [user, setUser] = useState({})

  const [showProfileModal, setShowProfileModal]   = useState(false)
  const [profileLoading, setProfileLoading]       = useState(false)
  const [profileError, setProfileError]           = useState('')
  const [formData, setFormData]                   = useState({ dateOfBirth: '', height: '', weight: '' })

  const { routine } = useRoutineContext()

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

  const [weeklySessions,  setWeeklySessions]  = useState([])
  const [weeklyLoading,   setWeeklyLoading]   = useState(true)
  const [alreadyTrainedToday, setAlreadyTrainedToday] = useState(false)

  const activeDaysCount = routine?.active_days_count ?? routine?.active_days?.length ?? 0

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(userData)
    if (!isProfileComplete(userData)) setShowProfileModal(true)
  }, [])

  const loadWeekly = async () => {
    if (!token) return
    setWeeklyLoading(true)
    try {
      const res = await getWeeklySessions()
      const sessions = res.data || []
      setWeeklySessions(sessions)

      const todayStr = new Date().toDateString()
      const trainedToday = sessions.some(s => new Date(s.started_at).toDateString() === todayStr)
      setAlreadyTrainedToday(trainedToday)
    } catch {
    
    } finally {
      setWeeklyLoading(false)
    }
  }

  useEffect(() => {
    loadWeekly()
  }, [isActive])

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
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
    } catch (err) {
    
    }
  }

  const handleFinishSession = async () => {
    try {
      await finishSession()
      await loadWeekly()
    } catch { /* sessionError visible */ }
  }

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  const monday = (() => {
    const d = new Date()
    const diff = d.getDay() === 0 ? 6 : d.getDay() - 1
    d.setDate(d.getDate() - diff)
    d.setHours(0, 0, 0, 0)
    return d
  })()

  const weekDaysDone = weekDays.map((_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    return weeklySessions.some(s => new Date(s.started_at).toDateString() === day.toDateString())
  })

  const startBtnLabel = (() => {
    if (sessionLoading)        return 'Un momento...'
    if (!routine)              return 'Sin rutina activa'
    if (alreadyTrainedToday)   return '¡Ya entrenaste hoy! ✓'
    return 'Iniciar entrenamiento'
  })()

  const canStart = routine && !isActive && !sessionLoading && !alreadyTrainedToday

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
            <p className="welcome-sub">
              Llevas {weeklySessions.length} sesión{weeklySessions.length !== 1 ? 'es' : ''} esta semana 💪
            </p>
          )}
        </div>
        <div className="welcome-date">{fechaStr}</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-valor">
            {weeklyLoading
              ? '—'
              : `${weeklySessions.length}/${activeDaysCount || '?'}`
            }
          </span>
          <span className="stat-label">Sesiones</span>
          <span className="stat-sub">esta semana</span>
        </div>

        <div className="stat-card">
          <span className="stat-valor">
            {isActive ? elapsedFormatted : '—'}
          </span>
          <span className="stat-label">Tiempo</span>
          <span className="stat-sub">{isActive ? 'en curso' : 'sin sesión activa'}</span>
        </div>

        <div className="stat-card">
          <span className="stat-valor">{sessionStats.totalLogs || '—'}</span>
          <span className="stat-label">Ejercicios</span>
          <span className="stat-sub">
            {isActive ? 'del entrenamiento' : todayExercises.length > 0 ? 'planificados hoy' : 'sin rutina hoy'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-valor">
            {sessionStats.totalVolume > 0 ? `${sessionStats.totalVolume}kg` : '—'}
          </span>
          <span className="stat-label">Volumen</span>
          <span className="stat-sub">
            {isActive ? 'esta sesión' : 'planificado hoy'}
          </span>
        </div>
      </div>

      {/* Card de sesión */}
      <div className="card">
        <h2 className="card-title">
          {isActive
            ? `⏱ Sesión en curso — ${elapsedFormatted}`
            : routine
              ? `Rutina activa — ${routine.name}`
              : 'Sin rutina activa'
          }
        </h2>

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
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            No hay ejercicios asignados para hoy ({nombreDia}).
          </p>
        ) : (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Ve a <strong>Rutinas</strong> para crear o activar una rutina.
          </p>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {!isActive ? (
            <button
              className="btn-iniciar"
              onClick={handleStartSession}
              disabled={!canStart}
              title={!routine ? 'Activa una rutina primero' : alreadyTrainedToday ? 'Ya entrenaste hoy' : ''}
              style={alreadyTrainedToday ? { background: 'linear-gradient(90deg,#28a745,#20c997)', cursor: 'default' } : {}}
            >
              {startBtnLabel}
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
                  cursor: sessionLoading ? 'not-allowed' : 'pointer'
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
