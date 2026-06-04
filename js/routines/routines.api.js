const API = '/api/routines'

const authHeader = (token) => ({
  Authorization: `Bearer ${token}`
})

const jsonHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
})

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Sesión expirada. Redirigiendo al login...')
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || `Error del servidor: ${res.status}`)
  }

  return data
}

const safeFetch = async (url, options) => {
  try {
    return await fetch(url, options)
  } catch {
    throw new Error(
      'No se pudo conectar al servidor. Verifica que el backend esté corriendo.'
    )
  }
}

export const getRoutines = async (token) => {
  const res = await safeFetch(API, {
    headers: authHeader(token)
  })
  return handleResponse(res)
}

export const getTemplates = async (token) => {
  const res = await safeFetch(`${API}/templates`, {
    headers: authHeader(token)
  })
  return handleResponse(res)
}

export const getActiveRoutine = async (token) => {
  const res = await safeFetch(`${API}/active`, {
    headers: authHeader(token)
  })
  return handleResponse(res)
}

export const getFavorites = async (token) => {
  const res = await safeFetch(`${API}/favorites`, {
    headers: authHeader(token)
  })
  return handleResponse(res)
}

export const toggleFavorite = async (token, id) => {
  const res = await safeFetch(`${API}/favorites/${id}/toggle`, {
    method: 'PUT',
    headers: authHeader(token)
  })
  return handleResponse(res)
}

export const getRoutineById = async (token, id) => {
  const res = await safeFetch(`${API}/${id}`, {
    headers: authHeader(token)
  })
  return handleResponse(res)
}

export const createRoutine = async (token, body) => {
  const res = await safeFetch(API, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(body)
  })
  return handleResponse(res)
}

export const updateRoutine = async (token, id, body) => {
  const res = await safeFetch(`${API}/${id}`, {
    method: 'PUT',
    headers: jsonHeaders(token),
    body: JSON.stringify(body)
  })
  return handleResponse(res)
}

export const deleteRoutine = async (token, id) => {
  const res = await safeFetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: authHeader(token)
  })
  return handleResponse(res)
}

export const activateRoutine = async (token, id) => {
  const res = await safeFetch(`${API}/${id}/activate`, {
    method: 'PUT',
    headers: authHeader(token)
  })
  return handleResponse(res)
}

export const useTemplate = async (token, templateId) => {
  const res = await safeFetch(`${API}/templates/${templateId}/use`, {
    method: 'POST',
    headers: authHeader(token)
  })
  return handleResponse(res)
}

export const getRoutineExercises = async (token, routineId) => {
  const res = await safeFetch(`${API}/${routineId}/exercises`, {
    headers: authHeader(token)
  })
  return handleResponse(res)
}

export const addExercise = async (
  token,
  routineId,
  {
    exercise_id,
    day_number,
    target_sets,
    target_reps,
    rest_seconds,
    target_weight_kg,
    notes
  }
) => {
  const res = await safeFetch(`${API}/${routineId}/exercises`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({
      exercise_id,
      day_number,
      target_sets,
      target_reps,
      rest_seconds,
      target_weight_kg: target_weight_kg ?? 0,
      notes
    })
  })

  return handleResponse(res)
}

export const updateExercise = async (token, routineExerciseId, body) => {
  const res = await safeFetch(`${API}/exercises/${routineExerciseId}`, {
    method: 'PUT',
    headers: jsonHeaders(token),
    body: JSON.stringify(body)
  })
  return handleResponse(res)
}

export const removeExercise = async (token, routineExerciseId) => {
  const res = await safeFetch(`${API}/exercises/${routineExerciseId}`, {
    method: 'DELETE',
    headers: authHeader(token)
  })
  return handleResponse(res)
}