import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateProfile, getProfile } from '../../js/profile/profile.api'
import { calculateIMC, getIMCStatus } from '../../js/utils/imc'
import './profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    height: '',
    weight: ''
  })
  
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await getProfile(token)
      setProfileData(data)
      
      if (data.age) {
        // Calcular fecha de nacimiento aproximada
        const today = new Date()
        const birthYear = today.getFullYear() - data.age
        setFormData({
          dateOfBirth: `${birthYear}-01-01`,
          height: data.height || '',
          weight: data.weight || ''
        })
      } else {
        setIsEditing(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const updated = await updateProfile(token, formData)
      setProfileData(updated)
      setIsEditing(false)
      setSuccess('Perfil actualizado exitosamente')
      
      // Actualizar localStorage
      localStorage.setItem('user', JSON.stringify({ ...user, age: updated.age }))
      
      // Redirigir al dashboard después de guardar
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="profile-container"><p>Cargando...</p></div>

  const imc = profileData?.imc ? getIMCStatus(profileData.imc) : null

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Mi Perfil</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Altura (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="ej: 175"
                required
              />
            </div>

            <div className="form-group">
              <label>Peso (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="ej: 75"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-save">Guardar</button>
              {profileData?.age && (
                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-group">
              <label>Nombre</label>
              <p>{user.name || 'N/A'}</p>
            </div>

            <div className="info-group">
              <label>Email</label>
              <p>{user.email || 'N/A'}</p>
            </div>

            {profileData?.age && (
              <>
                <div className="info-group">
                  <label>Edad</label>
                  <p>{profileData.age} años</p>
                </div>

                <div className="info-group">
                  <label>Altura</label>
                  <p>{profileData.height} cm</p>
                </div>

                <div className="info-group">
                  <label>Peso</label>
                  <p>{profileData.weight} kg</p>
                </div>

                <div className="info-group imc-group">
                  <label>IMC</label>
                  <div className="imc-display" style={{ backgroundColor: imc.hex }}>
                    <p className="imc-value">{profileData.imc}</p>
                    <p className="imc-status">{imc.status}</p>
                    <p className="imc-recommendation">{imc.recommendation}</p>
                  </div>
                </div>
              </>
            )}

            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Editar Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
