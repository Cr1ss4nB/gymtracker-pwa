import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const user = JSON.parse(localStorage.getItem('user') || '{}')

const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const hoy = new Date()
const nombreDia = dias[hoy.getDay()]
const fecha = hoy.toLocaleDateString('es-CO', {
  weekday: 'long', day: 'numeric', month: 'long'
})

const stats = [
  { valor: '3', label: 'Sesiones', sub: 'esta semana' },
  { valor: '45min', label: 'Hoy', sub: 'entrenado' },
  { valor: '120kg', label: 'Semana', sub: 'levantado' },
  { valor: '2/5', label: 'Días', sub: 'completados' },
]

const ejerciciosHoy = [
  { nombre: 'Sentadilla', series: 4, reps: 12 },
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

const Dashboard = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Si es primera vez (sin age), redirige a perfil
    if (!user.age) {
      navigate('/profile')
    }
  }, [navigate])
  
  return (
    <>
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