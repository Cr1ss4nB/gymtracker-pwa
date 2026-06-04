const API_URL = '/api/exercises'

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
    if (!res.ok) throw new Error(data.error || `Error del servidor: ${res.status}`)
    return data
}

const safeFetch = async (url, options) => {
    try {
        return await fetch(url, options)
    } catch {
        throw new Error('No se pudo conectar al servidor')
    }
}

export const getExercises = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.muscle_group) params.append('muscle_group', filters.muscle_group)
    if (filters.equipment) params.append('equipment', filters.equipment)
    if (filters.difficulty) params.append('difficulty', filters.difficulty)
    if (filters.is_home !== undefined && filters.is_home !== null) {
        params.append('is_home', filters.is_home)
    }
    if (filters.search && filters.search.trim() !== '') {
        params.append('search', filters.search.trim())
    }

    const queryString = params.toString()
    const url = queryString ? `${API_URL}?${queryString}` : API_URL

    const res = await safeFetch(url, { headers: authHeader() })
    const json = await handleResponse(res)
    return json.data || []
}

export const getExerciseById = async (id) => {
    const res = await safeFetch(`${API_URL}/${id}`, { headers: authHeader() })
    const json = await handleResponse(res)
    return json.data
}
