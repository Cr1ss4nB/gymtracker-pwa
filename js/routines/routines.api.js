const API = '/api/routines'

const authHeader = (token) => ({ 'Authorization': `Bearer ${token}` })
const jsonHeaders = (token) => ({ 'Content-Type': 'application/json', ...authHeader(token) })

const handleResponse = async (res) => {
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Error en la petición')
    return data
}

export const getRoutines = async (token) => {
    const res = await fetch(API, { headers: authHeader(token) })
    return handleResponse(res)
}

export const getTemplates = async (token) => {
    const res = await fetch(`${API}/templates`, { headers: authHeader(token) })
    return handleResponse(res)
}

export const getActiveRoutine = async (token) => {
    const res = await fetch(`${API}/active`, { headers: authHeader(token) })
    return handleResponse(res)
}

export const getRoutineById = async (token, id) => {
    const res = await fetch(`${API}/${id}`, { headers: authHeader(token) })
    return handleResponse(res)
}

export const createRoutine = async (token, body) => {
    const res = await fetch(API, {
        method: 'POST',
        headers: jsonHeaders(token),
        body: JSON.stringify(body)
    })
    return handleResponse(res)
}

export const updateRoutine = async (token, id, body) => {
    const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: jsonHeaders(token),
        body: JSON.stringify(body)
    })
    return handleResponse(res)
}

export const deleteRoutine = async (token, id) => {
    const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: authHeader(token)
    })
    return handleResponse(res)
}

export const activateRoutine = async (token, id) => {
    const res = await fetch(`${API}/${id}/activate`, {
        method: 'PUT',
        headers: authHeader(token)
    })
    return handleResponse(res)
}

export const useTemplate = async (token, templateId) => {
    const res = await fetch(`${API}/templates/${templateId}/use`, {
        method: 'POST',
        headers: authHeader(token)
    })
    return handleResponse(res)
}

export const getRoutineExercises = async (token, routineId) => {
    const res = await fetch(`${API}/${routineId}/exercises`, { headers: authHeader(token) })
    return handleResponse(res)
}

export const addExercise = async (token, routineId, body) => {
    const res = await fetch(`${API}/${routineId}/exercises`, {
        method: 'POST',
        headers: jsonHeaders(token),
        body: JSON.stringify(body)
    })
    return handleResponse(res)
}

export const updateExercise = async (token, routineExerciseId, body) => {
    const res = await fetch(`${API}/exercises/${routineExerciseId}`, {
        method: 'PUT',
        headers: jsonHeaders(token),
        body: JSON.stringify(body)
    })
    return handleResponse(res)
}

export const removeExercise = async (token, routineExerciseId) => {
    const res = await fetch(`${API}/exercises/${routineExerciseId}`, {
        method: 'DELETE',
        headers: authHeader(token)
    })
    return handleResponse(res)
}
