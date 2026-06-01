import { useEffect, useState } from 'react'
import { updateProfile } from '../../js/profile/profile.api'
import './dashboard.css'

const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const hoy = new Date()
const nombreDia = dias[hoy.getDay()]
const fecha = hoy.toLocaleDateString('es-CO', {
  weekday: 'long', day: 'numeric', month: 'long'
})

// Datos estáticos temporales — se reemplazarán con datos reales en fase sesiones
const stats = [
  { valor: '3', label: 'Sesiones', sub: 'esta semana' },
  { valor: '45min', label: 'Hoy', sub: 'entrenado' },
  { valor: '120kg', label: 'Semana', sub: 'levantado' },
  { valor: '2/5', label: 'Días', sub: 'completados' },
]

const ejerciciosHoy = [
  { nombre: 'Sentadilla con barra', series: 4, reps: 12 },
  { nombre: 'Peso muerto', series: 3, reps: 8 },
  { nombre: 'Prensa', series: 4, reps: 10 },
]

const semana = [
  { dia: 'L', hecho: true },
  { dia: 'M', hecho: true },
  { dia: 'X', hecho: false },
  { dia: 'J', hecho: false },
  { dia: 'V', hecho: false },
  { dia: 'S', hecho: false },
  { dia: 'D', hecho: false },
]

// Verifica si el perfil físico está completo
const isProfileComplete = (userData) => {
  return (
    userData &&
    userData.age != null && userData.age > 0 &&
    userData.height != null && userData.height > 0 &&
    userData.weight != null && userData.weight > 0
  )
}

const Dashboard = () => {
  const token = localStorage.getItem('token')
  const [user, setUser] = useState({})
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    height: '',
    weight: ''
  })

  useEffect(() => {
    // Leer datos del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(userData)

    // Mostrar modal SOLO si el perfil físico no está completo
    // Un perfil se considera incompleto si falta age, height o weight
    if (!isProfileComplete(userData)) {
      setShowProfileModal(true)
    }
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const updated = await updateProfile(token, formData)

      // Actualizar localStorage con perfil completo para no volver a mostrar modal
      const updatedUser = {
        ...user,
        age: updated.age,
        height: updated.height,
        weight: updated.weight,
        imc: updated.imc
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      setShowProfileModal(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Modal de onboarding — solo aparece si perfil físico incompleto */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Completa tu perfil</h2>
            <p>Necesitamos algunos datos para personalizar tu experiencia</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleProfileSubmit} className="modal-form">
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Altura (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleFormChange}
                  placeholder="170"
                  min="140"
                  max="220"
                  required
                />
              </div>

              <div className="form-group">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleFormChange}
                  placeholder="70"
                  min="30"
                  max="300"
                  required
                />
              </div>

              <button type="submit" className="modal-btn" disabled={loading}>
                {loading ? 'Guardando...' : 'Completar perfil'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bienvenida */}
      <div className="welcome-card">
        <div>
          <h1 className="welcome-title">
            Hola {user.name || 'Usuario'}, hoy es {nombreDia}
          </h1>
          <p className="welcome-sub">Llevas 5 días de racha — ¡sigue así!</p>
        </div>
        <div className="welcome-date">{fecha}</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <span className="stat-valor">{s.valor}</span>
            <span className="stat-label">{s.label}</span>
            <span className="stat-sub">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Rutina de hoy */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Rutina de hoy — Día de piernas</h2>
        </div>
        <div className="ejercicios-list">
          {ejerciciosHoy.map((ej, i) => (
            <div key={i} className="ejercicio-item">
              <span className="ejercicio-nombre">{ej.nombre}</span>
              <span className="ejercicio-series">{ej.series}x{ej.reps}</span>
            </div>
          ))}
        </div>
        <button className="btn-iniciar">Iniciar entrenamiento</button>
      </div>

      {/* Progreso semanal */}
      <div className="card">
        <h2 className="card-title">Progreso esta semana</h2>
        <div className="semana-grid">
          {semana.map((d, i) => (
            <div key={i} className="dia-item">
              <span className="dia-label">{d.dia}</span>
              <span className={`dia-check ${d.hecho ? 'hecho' : ''}`}>
                {d.hecho ? '✓' : '○'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Dashboard
