const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes     = require('./routes/auth.routes')
const profileRoutes  = require('./routes/profile.routes')
const exercisesRoutes = require('./routes/exercises.routes')
const routinesRoutes  = require('./routes/routines.routes')
const sessionsRoutes  = require('./routes/sessions.routes')
const progressRoutes  = require('./routes/progress.routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/auth',      authRoutes)
app.use('/api/profile',   profileRoutes)
app.use('/api/exercises', exercisesRoutes)
app.use('/api/routines',  routinesRoutes)
app.use('/api/sessions',  sessionsRoutes)
app.use('/api/progress',  progressRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
