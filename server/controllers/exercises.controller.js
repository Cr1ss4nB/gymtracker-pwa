const supabase = require('../config/db')

/**
 * GET /api/exercises
 *
 * Filtros opcionales via query params:
 *   ?muscle_group=Piernas
 *   ?equipment=Barra
 *   ?difficulty=Intermedio
 *   ?is_home=true
 *   ?search=sentadilla
 *
 * Todos los filtros son opcionales y combinables.
 * El filtrado se aplica en Supabase para no traer los 100+ registros
 * y luego filtrar en Node — la BD hace el trabajo pesado.
 */
const getExercises = async (req, res) => {
    try {
        const { muscle_group, equipment, difficulty, is_home, search } = req.query

        // Construir query base — campos necesarios para la card del frontend
        let query = supabase
            .from('exercises')
            .select('id, name, muscle_group, submuscles, equipment, difficulty, image_url, is_home, is_gym, description')
            .order('name', { ascending: true })

        // Filtro: grupo muscular exacto
        if (muscle_group && muscle_group.trim() !== '') {
            query = query.eq('muscle_group', muscle_group.trim())
        }

        // Filtro: equipamiento exacto
        if (equipment && equipment.trim() !== '') {
            query = query.eq('equipment', equipment.trim())
        }

        // Filtro: dificultad exacta
        if (difficulty && difficulty.trim() !== '') {
            query = query.eq('difficulty', difficulty.trim())
        }

        // Filtro: ejercicios en casa (boolean)
        // Acepta string 'true'/'false' desde query params
        if (is_home !== undefined && is_home !== '') {
            query = query.eq('is_home', is_home === 'true')
        }

        // Filtro: búsqueda por nombre (case-insensitive, partial match)
        if (search && search.trim() !== '') {
            query = query.ilike('name', `%${search.trim()}%`)
        }

        const { data, error } = await query

        if (error) {
            return res.status(500).json({ error: error.message })
        }

        res.json({ data: data || [] })
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

/**
 * GET /api/exercises/:id
 *
 * Devuelve todos los campos de un ejercicio específico.
 * Útil para el detalle expandido o para el Kanban de rutinas.
 */
const getExerciseById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ error: 'ID requerido' })
        }

        const { data, error } = await supabase
            .from('exercises')
            .select('id, name, muscle_group, submuscles, equipment, difficulty, image_url, is_home, is_gym, description, created_at')
            .eq('id', id)
            .single()

        if (error || !data) {
            return res.status(404).json({ error: 'Ejercicio no encontrado' })
        }

        res.json({ data })
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

module.exports = { getExercises, getExerciseById }
