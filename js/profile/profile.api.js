const API_URL = '/api'

export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Error al obtener perfil')
  return res.json()
}

export const updateProfile = async (token, { dateOfBirth, height, weight }) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ dateOfBirth, height, weight })
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }
  return res.json()
}