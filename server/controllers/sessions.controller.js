const supabase = require('../config/db')

const SESSION_SELECT = 'id, user_id, routine_id, started_at, finished_at, duration_seconds, status, created_at'

const LOG_SELECT = `
  id, session_id, exercise_id, performed_sets, performed_reps,
  performed_weight_kg, notes, created_at,
  exercises (id, name, muscle_group, equipment, difficulty)
`

// POST /api/sessions/start

const startSession = async (req, res) => {
  const userId = req.user.id
  const { routine_id } = req.body

  await supabase
    .from('workout_sessions')
    .update({ status: 'CANCELLED', finished_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('status', 'IN_PROGRESS')

  if (routine_id) {
    const { data: routine } = await supabase
      .from('routines').select('id, user_id').eq('id', routine_id).single()
    if (!routine || routine.user_id !== userId) {
      return res.status(403).json({ error: 'Rutina no válida' })
    }
  }

  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: userId,
      routine_id: routine_id || null,
      started_at: new Date().toISOString(),
      status: 'IN_PROGRESS'
    })
    .select(SESSION_SELECT)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json({ data })
}

// POST /api/sessions/:id/finish

const finishSession = async (req, res) => {
  const userId = req.user.id
  const { id } = req.params

  const { data: session, error: fetchError } = await supabase
    .from('workout_sessions').select('id, user_id, started_at, status').eq('id', id).single()

  if (fetchError || !session) return res.status(404).json({ error: 'Sesión no encontrada' })
  if (session.user_id !== userId) return res.status(403).json({ error: 'Sin permiso' })
  if (session.status !== 'IN_PROGRESS') return res.status(400).json({ error: 'La sesión no está activa' })

  const finishedAt = new Date()
  const startedAt = new Date(session.started_at)
  const durationSeconds = Math.round((finishedAt - startedAt) / 1000)

  const { data, error } = await supabase
    .from('workout_sessions')
    .update({ status: 'COMPLETED', finished_at: finishedAt.toISOString(), duration_seconds: durationSeconds })
    .eq('id', id).select(SESSION_SELECT).single()

  if (error) return res.status(500).json({ error: error.message })
  res.json({ data })
}

// POST /api/sessions/:id/cancel

const cancelSession = async (req, res) => {
  const userId = req.user.id
  const { id } = req.params

  const { data: session, error: fetchError } = await supabase
    .from('workout_sessions').select('id, user_id, status').eq('id', id).single()

  if (fetchError || !session) return res.status(404).json({ error: 'Sesión no encontrada' })
  if (session.user_id !== userId) return res.status(403).json({ error: 'Sin permiso' })
  if (session.status !== 'IN_PROGRESS') return res.status(400).json({ error: 'La sesión no está activa' })

  const { data, error } = await supabase
    .from('workout_sessions')
    .update({ status: 'CANCELLED', finished_at: new Date().toISOString() })
    .eq('id', id).select(SESSION_SELECT).single()

  if (error) return res.status(500).json({ error: error.message })
  res.json({ data })
}

// GET /api/sessions/active

const getActiveSession = async (req, res) => {
  const userId = req.user.id

  const { data: session, error } = await supabase
    .from('workout_sessions')
    .select(SESSION_SELECT)
    .eq('user_id', userId)
    .eq('status', 'IN_PROGRESS')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return res.json({ data: null })
    return res.status(500).json({ error: error.message })
  }

  if (!session) return res.json({ data: null })

  const { data: logs } = await supabase
    .from('session_exercise_logs').select(LOG_SELECT)
    .eq('session_id', session.id).order('created_at', { ascending: true })

  res.json({ data: { ...session, logs: logs || [] } })
}

// GET /api/sessions/history

const getSessionHistory = async (req, res) => {
  const userId = req.user.id
  const limit = parseInt(req.query.limit) || 20
  const offset = parseInt(req.query.offset) || 0

  const { data, error, count } = await supabase
    .from('workout_sessions')
    .select(SESSION_SELECT, { count: 'exact' })
    .eq('user_id', userId)
    .eq('status', 'COMPLETED')
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ data: data || [], total: count || 0, limit, offset })
}

// GET /api/sessions/weekly

const getWeeklySessions = async (req, res) => {
  const userId = req.user.id

  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - daysToMonday)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  const { data, error, count } = await supabase
    .from('workout_sessions')
    .select(SESSION_SELECT, { count: 'exact' })
    .eq('user_id', userId)
    .eq('status', 'COMPLETED')
    .gte('started_at', monday.toISOString())
    .lte('started_at', sunday.toISOString())
    .order('started_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json({ data: data || [], total: count || 0, week_start: monday.toISOString() })
}

// GET /api/sessions/:id

const getSessionById = async (req, res) => {
  const userId = req.user.id
  const { id } = req.params

  const { data: session, error } = await supabase
    .from('workout_sessions').select(SESSION_SELECT).eq('id', id).single()

  if (error || !session) return res.status(404).json({ error: 'Sesión no encontrada' })
  if (session.user_id !== userId) return res.status(403).json({ error: 'Sin permiso' })

  const { data: logs } = await supabase
    .from('session_exercise_logs').select(LOG_SELECT)
    .eq('session_id', id).order('created_at', { ascending: true })

  res.json({ data: { ...session, logs: logs || [] } })
}

// POST /api/sessions/:id/logs

const addLog = async (req, res) => {
  const userId = req.user.id
  const { id } = req.params
  const { exercise_id, performed_sets, performed_reps, performed_weight_kg, notes } = req.body

  if (!exercise_id) return res.status(400).json({ error: 'exercise_id es obligatorio' })

  const { data: session, error: sError } = await supabase
    .from('workout_sessions').select('id, user_id, status').eq('id', id).single()

  if (sError || !session) return res.status(404).json({ error: 'Sesión no encontrada' })
  if (session.user_id !== userId) return res.status(403).json({ error: 'Sin permiso' })
  if (session.status !== 'IN_PROGRESS') return res.status(400).json({ error: 'La sesión no está activa' })

  const { data, error } = await supabase
    .from('session_exercise_logs')
    .insert({
      session_id: id, exercise_id,
      performed_sets: performed_sets || null,
      performed_reps: performed_reps || null,
      performed_weight_kg: performed_weight_kg || null,
      notes: notes || null
    })
    .select(LOG_SELECT).single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json({ data })
}

module.exports = {
  startSession, finishSession, cancelSession,
  getActiveSession, getSessionHistory, getWeeklySessions,
  getSessionById, addLog
}
