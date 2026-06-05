const supabase = require('../config/db')

const getMondayOf = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

const weekRange = (monday) => {
  const end = new Date(monday)
  end.setDate(monday.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start: monday.toISOString(), end: end.toISOString() }
}

const fetchWeekSessions = async (userId, monday) => {
  const { start, end } = weekRange(monday)
  const { data } = await supabase
    .from('workout_sessions')
    .select('id, started_at, finished_at, duration_seconds, routine_id')
    .eq('user_id', userId)
    .eq('status', 'COMPLETED')
    .gte('started_at', start)
    .lte('started_at', end)
    .order('started_at', { ascending: true })

  const seen = new Set()
  return (data || []).filter(s => {
    const day = new Date(s.started_at).toDateString()
    if (seen.has(day)) return false
    seen.add(day)
    return true
  })
}

// GET /api/progress/summary

const getSummary = async (req, res) => {
  const userId = req.user.id

  const thisMonday = getMondayOf(new Date())
  const lastMonday = new Date(thisMonday)
  lastMonday.setDate(thisMonday.getDate() - 7)

  const [thisSessions, lastSessions] = await Promise.all([
    fetchWeekSessions(userId, thisMonday),
    fetchWeekSessions(userId, lastMonday)
  ])

  const calcVolume = async (sessions) => {
    let total = 0
    for (const s of sessions) {
      if (!s.routine_id) continue
      const dayNum = new Date(s.started_at).getDay()
      const dayNumber = dayNum === 0 ? 7 : dayNum
      const { data: exs } = await supabase
        .from('routine_exercises')
        .select('target_weight_kg')
        .eq('routine_id', s.routine_id)
        .eq('day_number', dayNumber)
      total += (exs || []).reduce((acc, e) => acc + (e.target_weight_kg || 0), 0)
    }
    return Math.round(total)
  }

  const [thisVolume, lastVolume] = await Promise.all([
    calcVolume(thisSessions),
    calcVolume(lastSessions)
  ])

  const thisDuration = thisSessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0)
  const lastDuration = lastSessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0)
  const avgDuration  = thisSessions.length > 0
    ? Math.round(thisDuration / thisSessions.length)
    : 0

  const pct = (curr, prev) => {
    if (prev === 0) return curr > 0 ? 100 : null
    return Math.round(((curr - prev) / prev) * 100)
  }

  res.json({
    data: {
      this_week: {
        sessions:       thisSessions.length,
        volume_kg:      thisVolume,
        duration_total: thisDuration,
        avg_duration:   avgDuration,
        week_start:     thisMonday.toISOString()
      },
      last_week: {
        sessions:       lastSessions.length,
        volume_kg:      lastVolume,
        duration_total: lastDuration,
        week_start:     lastMonday.toISOString()
      },
      delta: {
        sessions: pct(thisSessions.length, lastSessions.length),
        volume:   pct(thisVolume, lastVolume),
        duration: pct(thisDuration, lastDuration)
      }
    }
  })
}

// GET /api/progress/streak

const getStreak = async (req, res) => {
  const userId = req.user.id

  const { data } = await supabase
    .from('workout_sessions')
    .select('started_at')
    .eq('user_id', userId)
    .eq('status', 'COMPLETED')
    .order('started_at', { ascending: false })
    .limit(60) 

  const trainedDays = new Set(
    (data || []).map(s => new Date(s.started_at).toDateString())
  )

  let streak = 0
  const cursor = new Date()
  cursor.setHours(12, 0, 0, 0)

  while (trainedDays.has(cursor.toDateString())) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  res.json({ data: { streak } })
}

// GET /api/progress/history 

const getHistory = async (req, res) => {
  const userId = req.user.id
  const limit  = Math.min(parseInt(req.query.limit)  || 10, 50)
  const offset = parseInt(req.query.offset) || 0

  const { data, error, count } = await supabase
    .from('workout_sessions')
    .select('id, started_at, finished_at, duration_seconds, status, routine_id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('status', 'COMPLETED')
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return res.status(500).json({ error: error.message })

  const enriched = await Promise.all((data || []).map(async (s) => {
    if (!s.routine_id) return { ...s, exercises_count: 0, volume_kg: 0 }

    const dayNum    = new Date(s.started_at).getDay()
    const dayNumber = dayNum === 0 ? 7 : dayNum

    const { data: exs } = await supabase
      .from('routine_exercises')
      .select('target_weight_kg')
      .eq('routine_id', s.routine_id)
      .eq('day_number', dayNumber)

    const exercises_count = (exs || []).length
    const volume_kg = Math.round((exs || []).reduce((a, e) => a + (e.target_weight_kg || 0), 0))

    return { ...s, exercises_count, volume_kg }
  }))

  res.json({ data: enriched, total: count || 0, limit, offset })
}

module.exports = { getSummary, getStreak, getHistory }
