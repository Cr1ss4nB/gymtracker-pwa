const supabase = require('../config/db')

const ROUTINE_SELECT = 'id, name, description, is_template, template_type, equipment_type, days_per_week, is_favorite, is_active, created_at, updated_at'

const ROUTINE_EXERCISES_SELECT = `
    id, day_number, order_index, target_sets, target_reps, rest_seconds, notes,
    exercises (id, name, muscle_group, submuscles, equipment, difficulty, image_url, is_home)
`

// Desactiva todas las rutinas del usuario antes de activar una nueva.
// Garantiza que solo haya una rutina activa por usuario.
const deactivateAllUserRoutines = async (userId) => {
    return supabase
        .from('routines')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true)
}

// GET /api/routines — rutinas del usuario (excluye templates del sistema)
const getRoutines = async (req, res) => {
    const userId = req.user.id

    const { data, error } = await supabase
        .from('routines')
        .select(ROUTINE_SELECT)
        .eq('user_id', userId)
        .eq('is_template', false)
        .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })

    res.json({ data: data || [] })
}

// GET /api/routines/templates — templates del sistema disponibles
const getTemplates = async (req, res) => {
    const { data, error } = await supabase
        .from('routines')
        .select(ROUTINE_SELECT)
        .eq('is_template', true)
        .order('template_type')
        .order('days_per_week')

    if (error) return res.status(500).json({ error: error.message })

    res.json({ data: data || [] })
}

// GET /api/routines/active — rutina activa del usuario con ejercicios agrupados por día
const getActiveRoutine = async (req, res) => {
    const userId = req.user.id

    const { data: routine, error: routineError } = await supabase
        .from('routines')
        .select(ROUTINE_SELECT)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single()

    if (routineError) {
        // PGRST116 = no rows found — usuario sin rutina activa, no es un error
        if (routineError.code === 'PGRST116') {
            return res.json({ data: null })
        }
        return res.status(500).json({ error: routineError.message })
    }

    if (!routine) return res.json({ data: null })

    // Traer ejercicios de la rutina activa ordenados
    const { data: exercises, error: exercisesError } = await supabase
        .from('routine_exercises')
        .select(ROUTINE_EXERCISES_SELECT)
        .eq('routine_id', routine.id)
        .order('day_number')
        .order('order_index')

    if (exercisesError) return res.status(500).json({ error: exercisesError.message })

    // Agrupar ejercicios por día para facilitar el render del calendario
    const byDay = {}
    for (let d = 1; d <= 7; d++) byDay[d] = []
    for (const ex of exercises || []) {
        if (byDay[ex.day_number]) byDay[ex.day_number].push(ex)
    }

    res.json({ data: { ...routine, exercises_by_day: byDay } })
}

// GET /api/routines/:id — detalle de una rutina con ejercicios
const getRoutineById = async (req, res) => {
    const userId = req.user.id
    const { id } = req.params

    const { data: routine, error } = await supabase
        .from('routines')
        .select(ROUTINE_SELECT)
        .eq('id', id)
        .single()

    if (error || !routine) return res.status(404).json({ error: 'Rutina no encontrada' })

    // Solo el dueño puede ver sus rutinas; templates son visibles para todos
    if (!routine.is_template && routine.user_id !== userId) {
        return res.status(403).json({ error: 'Sin permiso' })
    }

    const { data: exercises, error: exError } = await supabase
        .from('routine_exercises')
        .select(ROUTINE_EXERCISES_SELECT)
        .eq('routine_id', id)
        .order('day_number')
        .order('order_index')

    if (exError) return res.status(500).json({ error: exError.message })

    res.json({ data: { ...routine, exercises: exercises || [] } })
}

// POST /api/routines — crear rutina vacía manual
const createRoutine = async (req, res) => {
    const userId = req.user.id
    const { name, description, days_per_week } = req.body

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'El nombre es obligatorio' })
    }

    const { data, error } = await supabase
        .from('routines')
        .insert({
            user_id: userId,
            name: name.trim(),
            description: description || '',
            is_template: false,
            days_per_week: days_per_week || 3,
            is_active: false
        })
        .select(ROUTINE_SELECT)
        .single()

    if (error) return res.status(500).json({ error: error.message })

    res.status(201).json({ data })
}

// PUT /api/routines/:id — actualizar metadatos de una rutina
const updateRoutine = async (req, res) => {
    const userId = req.user.id
    const { id } = req.params
    const { name, description, days_per_week } = req.body

    const { data: existing, error: fetchError } = await supabase
        .from('routines')
        .select('id, user_id, is_template')
        .eq('id', id)
        .single()

    if (fetchError || !existing) return res.status(404).json({ error: 'Rutina no encontrada' })
    if (existing.is_template) return res.status(403).json({ error: 'No se pueden editar templates originales' })
    if (existing.user_id !== userId) return res.status(403).json({ error: 'Sin permiso' })

    const updates = {}
    if (name) updates.name = name.trim()
    if (description !== undefined) updates.description = description
    if (days_per_week) updates.days_per_week = days_per_week
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
        .from('routines')
        .update(updates)
        .eq('id', id)
        .select(ROUTINE_SELECT)
        .single()

    if (error) return res.status(500).json({ error: error.message })

    res.json({ data })
}

// DELETE /api/routines/:id
const deleteRoutine = async (req, res) => {
    const userId = req.user.id
    const { id } = req.params

    const { data: existing, error: fetchError } = await supabase
        .from('routines')
        .select('id, user_id, is_template')
        .eq('id', id)
        .single()

    if (fetchError || !existing) return res.status(404).json({ error: 'Rutina no encontrada' })
    if (existing.is_template) return res.status(403).json({ error: 'No se pueden eliminar templates originales' })
    if (existing.user_id !== userId) return res.status(403).json({ error: 'Sin permiso' })

    await supabase.from('routine_exercises').delete().eq('routine_id', id)

    const { error } = await supabase.from('routines').delete().eq('id', id)

    if (error) return res.status(500).json({ error: error.message })

    res.json({ message: 'Rutina eliminada' })
}

// POST /api/routines/templates/:templateId/use — clonar template para el usuario
const useTemplate = async (req, res) => {
    const userId = req.user.id
    const { templateId } = req.params

    // Verificar que la template existe
    const { data: template, error: tError } = await supabase
        .from('routines')
        .select(ROUTINE_SELECT)
        .eq('id', templateId)
        .eq('is_template', true)
        .single()

    if (tError || !template) return res.status(404).json({ error: 'Template no encontrada' })

    // Traer ejercicios de la template
    const { data: templateExercises, error: exError } = await supabase
        .from('routine_exercises')
        .select('exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes')
        .eq('routine_id', templateId)
        .order('day_number')
        .order('order_index')

    if (exError) return res.status(500).json({ error: exError.message })

    // Desactivar rutinas activas del usuario antes de crear la nueva
    await deactivateAllUserRoutines(userId)

    // Crear la rutina clonada para el usuario
    const { data: newRoutine, error: createError } = await supabase
        .from('routines')
        .insert({
            user_id: userId,
            name: template.name,
            description: template.description,
            is_template: false,
            template_type: template.template_type,
            equipment_type: template.equipment_type,
            days_per_week: template.days_per_week,
            is_active: true,
            is_favorite: false
        })
        .select(ROUTINE_SELECT)
        .single()

    if (createError) return res.status(500).json({ error: createError.message })

    // Clonar los ejercicios de la template a la nueva rutina
    if (templateExercises && templateExercises.length > 0) {
        const exercisesToInsert = templateExercises.map(ex => ({
            routine_id: newRoutine.id,
            exercise_id: ex.exercise_id,
            day_number: ex.day_number,
            order_index: ex.order_index,
            target_sets: ex.target_sets,
            target_reps: ex.target_reps,
            rest_seconds: ex.rest_seconds,
            notes: ex.notes
        }))

        const { error: insertError } = await supabase
            .from('routine_exercises')
            .insert(exercisesToInsert)

        if (insertError) {
            // Revertir: eliminar la rutina creada si falla la inserción de ejercicios
            await supabase.from('routines').delete().eq('id', newRoutine.id)
            return res.status(500).json({ error: 'Error al clonar ejercicios de la template' })
        }
    }

    // Retornar la rutina nueva con ejercicios agrupados por día
    const { data: exercises } = await supabase
        .from('routine_exercises')
        .select(ROUTINE_EXERCISES_SELECT)
        .eq('routine_id', newRoutine.id)
        .order('day_number')
        .order('order_index')

    const byDay = {}
    for (let d = 1; d <= 7; d++) byDay[d] = []
    for (const ex of exercises || []) {
        if (byDay[ex.day_number]) byDay[ex.day_number].push(ex)
    }

    res.status(201).json({ data: { ...newRoutine, exercises_by_day: byDay } })
}

// PUT /api/routines/:id/activate — activar una rutina del usuario
const activateRoutine = async (req, res) => {
    const userId = req.user.id
    const { id } = req.params

    const { data: existing, error: fetchError } = await supabase
        .from('routines')
        .select('id, user_id, is_template')
        .eq('id', id)
        .single()

    if (fetchError || !existing) return res.status(404).json({ error: 'Rutina no encontrada' })
    if (existing.is_template) return res.status(403).json({ error: 'No se puede activar una template directamente' })
    if (existing.user_id !== userId) return res.status(403).json({ error: 'Sin permiso' })

    await deactivateAllUserRoutines(userId)

    const { data, error } = await supabase
        .from('routines')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(ROUTINE_SELECT)
        .single()

    if (error) return res.status(500).json({ error: error.message })

    res.json({ data })
}

// GET /api/routines/:id/exercises
const getRoutineExercises = async (req, res) => {
    const userId = req.user.id
    const { id } = req.params

    const { data: routine, error: rError } = await supabase
        .from('routines')
        .select('id, user_id, is_template')
        .eq('id', id)
        .single()

    if (rError || !routine) return res.status(404).json({ error: 'Rutina no encontrada' })
    if (!routine.is_template && routine.user_id !== userId) return res.status(403).json({ error: 'Sin permiso' })

    const { data, error } = await supabase
        .from('routine_exercises')
        .select(ROUTINE_EXERCISES_SELECT)
        .eq('routine_id', id)
        .order('day_number')
        .order('order_index')

    if (error) return res.status(500).json({ error: error.message })

    res.json({ data: data || [] })
}

// POST /api/routines/:id/exercises — agregar ejercicio a una rutina
const addExercise = async (req, res) => {
    const userId = req.user.id
    const { id } = req.params
    const { exercise_id, day_number, target_sets, target_reps, rest_seconds, notes } = req.body

    if (!exercise_id || !day_number) {
        return res.status(400).json({ error: 'exercise_id y day_number son obligatorios' })
    }
    if (day_number < 1 || day_number > 7) {
        return res.status(400).json({ error: 'day_number debe estar entre 1 y 7' })
    }

    const { data: routine, error: rError } = await supabase
        .from('routines')
        .select('id, user_id, is_template')
        .eq('id', id)
        .single()

    if (rError || !routine) return res.status(404).json({ error: 'Rutina no encontrada' })
    if (routine.is_template) return res.status(403).json({ error: 'No se pueden modificar templates originales' })
    if (routine.user_id !== userId) return res.status(403).json({ error: 'Sin permiso' })

    // Calcular el siguiente order_index para el día
    const { data: existing } = await supabase
        .from('routine_exercises')
        .select('order_index')
        .eq('routine_id', id)
        .eq('day_number', day_number)
        .order('order_index', { ascending: false })
        .limit(1)

    const nextIndex = existing && existing.length > 0 ? existing[0].order_index + 1 : 0

    const { data, error } = await supabase
        .from('routine_exercises')
        .insert({
            routine_id: id,
            exercise_id,
            day_number,
            order_index: nextIndex,
            target_sets: target_sets || 3,
            target_reps: target_reps || 10,
            rest_seconds: rest_seconds || 90,
            notes: notes || null
        })
        .select(ROUTINE_EXERCISES_SELECT)
        .single()

    if (error) return res.status(500).json({ error: error.message })

    res.status(201).json({ data })
}

// PUT /api/routines/exercises/:routineExerciseId — editar series/reps/día
const updateExercise = async (req, res) => {
    const userId = req.user.id
    const { routineExerciseId } = req.params
    const { target_sets, target_reps, rest_seconds, day_number, order_index, notes } = req.body

    // Verificar propiedad a través de la rutina
    const { data: re, error: reError } = await supabase
        .from('routine_exercises')
        .select('id, routine_id')
        .eq('id', routineExerciseId)
        .single()

    if (reError || !re) return res.status(404).json({ error: 'Entrada no encontrada' })

    const { data: routine, error: rError } = await supabase
        .from('routines')
        .select('user_id, is_template')
        .eq('id', re.routine_id)
        .single()

    if (rError || !routine) return res.status(404).json({ error: 'Rutina no encontrada' })
    if (routine.is_template) return res.status(403).json({ error: 'No se pueden modificar templates originales' })
    if (routine.user_id !== userId) return res.status(403).json({ error: 'Sin permiso' })

    const updates = {}
    if (target_sets !== undefined) updates.target_sets = target_sets
    if (target_reps !== undefined) updates.target_reps = target_reps
    if (rest_seconds !== undefined) updates.rest_seconds = rest_seconds
    if (day_number !== undefined) updates.day_number = day_number
    if (order_index !== undefined) updates.order_index = order_index
    if (notes !== undefined) updates.notes = notes

    const { data, error } = await supabase
        .from('routine_exercises')
        .update(updates)
        .eq('id', routineExerciseId)
        .select(ROUTINE_EXERCISES_SELECT)
        .single()

    if (error) return res.status(500).json({ error: error.message })

    res.json({ data })
}

// DELETE /api/routines/exercises/:routineExerciseId
const removeExercise = async (req, res) => {
    const userId = req.user.id
    const { routineExerciseId } = req.params

    const { data: re, error: reError } = await supabase
        .from('routine_exercises')
        .select('id, routine_id')
        .eq('id', routineExerciseId)
        .single()

    if (reError || !re) return res.status(404).json({ error: 'Entrada no encontrada' })

    const { data: routine, error: rError } = await supabase
        .from('routines')
        .select('user_id, is_template')
        .eq('id', re.routine_id)
        .single()

    if (rError || !routine) return res.status(404).json({ error: 'Rutina no encontrada' })
    if (routine.is_template) return res.status(403).json({ error: 'No se pueden modificar templates originales' })
    if (routine.user_id !== userId) return res.status(403).json({ error: 'Sin permiso' })

    const { error } = await supabase
        .from('routine_exercises')
        .delete()
        .eq('id', routineExerciseId)

    if (error) return res.status(500).json({ error: error.message })

    res.json({ message: 'Ejercicio eliminado de la rutina' })
}

module.exports = {
    getRoutines,
    getTemplates,
    getActiveRoutine,
    getRoutineById,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    useTemplate,
    activateRoutine,
    getRoutineExercises,
    addExercise,
    updateExercise,
    removeExercise
}
