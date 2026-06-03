const API_URL = '/api/exercises'

/**
 * Obtiene la lista de ejercicios con filtros.
 *
 * @param {string} token - JWT del usuario autenticado
 * @param {Object} filters - Filtros opcionales
 * @param {string} [filters.muscle_group] - Grupo muscular exacto
 * @param {string} [filters.equipment]    - Equipamiento exacto
 * @param {string} [filters.difficulty]   - Dificultad exacta
 * @param {boolean} [filters.is_home]     - Solo ejercicios en casa
 * @param {string} [filters.search]       - Búsqueda por nombre (parcial)
 *
 * @returns {Promise<Array>} Lista de ejercicios
 */
export const getExercises = async (token, filters = {}) => {
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

    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.error || 'Error al obtener ejercicios')
    }

    const json = await res.json()
    return json.data || []
}

/**
 * Obtiene el detalle de un ejercicio por ID.
 *
 * @param {string} token - JWT del usuario autenticado
 * @param {string} id    - UUID del ejercicio
 *
 * @returns {Promise<Object>} Ejercicio completo
 */
export const getExerciseById = async (token, id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.error || 'Error al obtener ejercicio')
    }

    const json = await res.json()
    return json.data
}
