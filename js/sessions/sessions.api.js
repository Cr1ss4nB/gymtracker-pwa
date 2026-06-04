const API = '/api/sessions'

const getToken = () => localStorage.getItem('token')

const authHeader = () => ({ 'Authorization': `Bearer ${getToken()}` })
const jsonHeaders = () => ({
    'Content-Type': 'application/json',
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
    if (!res.ok) throw new Error(data.error || `Error del servidor: ${res.status}`)
    return data
}

const safeFetch = async (url, options) => {
    try { return await fetch(url, options) }
    catch { throw new Error('No se pudo conectar al servidor') }
}

export const startSession = async (routineId = null) => {
    const res = await safeFetch(`${API}/start`, {
        method: 'POST', headers: jsonHeaders(),
        body: JSON.stringify({ routine_id: routineId })
    })
    return handleResponse(res)
}

export const finishSession = async (sessionId) => {
    const res = await safeFetch(`${API}/${sessionId}/finish`, {
        method: 'POST', headers: authHeader()
    })
    return handleResponse(res)
}

export const cancelSession = async (sessionId) => {
    const res = await safeFetch(`${API}/${sessionId}/cancel`, {
        method: 'POST', headers: authHeader()
    })
    return handleResponse(res)
}

export const getActiveSession = async () => {
    const res = await safeFetch(`${API}/active`, { headers: authHeader() })
    return handleResponse(res)
}

export const getSessionHistory = async ({ limit = 20, offset = 0 } = {}) => {
    const res = await safeFetch(`${API}/history?limit=${limit}&offset=${offset}`, {
        headers: authHeader()
    })
    return handleResponse(res)
}

export const getWeeklySessions = async () => {
    const res = await safeFetch(`${API}/weekly`, { headers: authHeader() })
    return handleResponse(res)
}

export const getSessionById = async (sessionId) => {
    const res = await safeFetch(`${API}/${sessionId}`, { headers: authHeader() })
    return handleResponse(res)
}

export const addLog = async (sessionId, { exercise_id, performed_sets, performed_reps, performed_weight_kg, notes }) => {
    const res = await safeFetch(`${API}/${sessionId}/logs`, {
        method: 'POST', headers: jsonHeaders(),
        body: JSON.stringify({ exercise_id, performed_sets, performed_reps, performed_weight_kg, notes })
    })
    return handleResponse(res)
}
