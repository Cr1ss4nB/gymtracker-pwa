import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/rutinas', label: 'Rutinas', icon: '📋' },
  { path: '/ejercicios', label: 'Ejercicios', icon: '💪' },
  { path: '/sesion', label: 'Sesión', icon: '▶️' },
  { path: '/progreso', label: 'Progreso', icon: '📈' },
  { path: '/reportes', label: 'Reportes', icon: '📄' },
  { path: '/perfil', label: 'Perfil', icon: '👤' },
]

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-text">GymTracker</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <span className="sidebar-icon">🚪</span>
        <span className="sidebar-label">Cerrar sesión</span>
      </button>
    </aside>
  )
}

export default Navbar