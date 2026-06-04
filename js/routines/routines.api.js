const API = '/api/routines'

const getToken = () => localStorage.getItem('token')

const authHeader = () => ({
  'Authorization': `Bearer ${getToken()}`
})

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
})

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Sesión expirada. Redirigiendo al login...')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error del servidor: ${res.status}`)
  return data
}

const safeFetch = async (url, options) => {
  try {
    return await fetch(url, options)
  } catch {
    throw new Error('No se pudo conectar al servidor. Verifica que el backend esté corriendo.')
  }
}

export const getRoutines = async () => {
  const res = await safeFetch(API, { headers: authHeader() })
  return handleResponse(res)
}

export const getTemplates = async () => {
  const res = await safeFetch(`${API}/templates`, { headers: authHeader() })
  return handleResponse(res)
}

export const getActiveRoutine = async () => {
  const res = await safeFetch(`${API}/active`, { headers: authHeader() })
  return handleResponse(res)
}

export const getRoutineById = async (id) => {
  const res = await safeFetch(`${API}/${id}`, { headers: authHeader() })
  return handleResponse(res)
}

export const createRoutine = async ({ name, description }) => {
  const res = await safeFetch(API, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ name, description })
  })
  return handleResponse(res)
}

export const updateRoutine = async (id, updates) => {
  const res = await safeFetch(`${API}/${id}`, {
    method: 'PUT',
    headers: jsonHeaders(),
    body: JSON.stringify(updates)
  })
  return handleResponse(res)
}

export const deleteRoutine = async (id) => {
  const res = await safeFetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  })
  return handleResponse(res)
}

export const activateRoutine = async (id) => {
  const res = await safeFetch(`${API}/${id}/activate`, {
    method: 'PUT',
    headers: authHeader()
  })
  return handleResponse(res)
}

export const useTemplate = async (templateId) => {
  const res = await safeFetch(`${API}/templates/${templateId}/use`, {
    method: 'POST',
    headers: authHeader()
  })
  return handleResponse(res)
}

export const getFavorites = async () => {
  const res = await safeFetch(`${API}/favorites`, { headers: authHeader() })
  return handleResponse(res)
}

export const toggleFavorite = async (id) => {
  const res = await safeFetch(`${API}/favorites/${id}/toggle`, {
    method: 'PUT',
    headers: authHeader()
  })
  return handleResponse(res)
}

export const getRoutineExercises = async (routineId) => {
  const res = await safeFetch(`${API}/${routineId}/exercises`, { headers: authHeader() })
  return handleResponse(res)
}

export const addExercise = async (routineId, {
  exercise_id, day_number, target_sets, target_reps,
  rest_seconds, target_weight_kg, notes
}) => {
  const res = await safeFetch(`${API}/${routineId}/exercises`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({
      exercise_id, day_number, target_sets, target_reps,
      rest_seconds, target_weight_kg: target_weight_kg ?? 0, notes
    })
  })
  return handleResponse(res)
}

export const updateExercise = async (routineExerciseId, updates) => {
  const res = await safeFetch(`${API}/exercises/${routineExerciseId}`, {
    method: 'PUT',
    headers: jsonHeaders(),
    body: JSON.stringify(updates)
  })
  return handleResponse(res)
}

export const removeExercise = async (routineExerciseId) => {
  const res = await safeFetch(`${API}/exercises/${routineExerciseId}`, {
    method: 'DELETE',
    headers: authHeader()
  })
  return handleResponse(res)
}
