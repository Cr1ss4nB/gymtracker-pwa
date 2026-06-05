const API = '/api/progress'

const getToken = () => localStorage.getItem('token')

const authHeader = () => ({
  'Authorization': `Bearer ${getToken()}`
})

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Sesión expirada')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}

const safeFetch = async (url, options) => {
  try { return await fetch(url, options) }
  catch { throw new Error('No se pudo conectar al servidor') }
}

export const getProgressSummary = async () => {
  const res = await safeFetch(`${API}/summary`, { headers: authHeader() })
  return handleResponse(res)
}

export const getStreak = async () => {
  const res = await safeFetch(`${API}/streak`, { headers: authHeader() })
  return handleResponse(res)
}

export const getProgressHistory = async ({ limit = 10, offset = 0 } = {}) => {
  const res = await safeFetch(`${API}/history?limit=${limit}&offset=${offset}`, {
    headers: authHeader()
  })
  return handleResponse(res)
}
