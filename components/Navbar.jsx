import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/rutinas', label: 'Rutinas' },
  { path: '/ejercicios', label: 'Ejercicios' },
  { path: '/progreso', label: 'Progreso' },
  { path: '/profile', label: 'Perfil' },
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
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <span className="sidebar-label">Cerrar sesión</span>
      </button>
    </aside>
  )
}

export default Navbar
