const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const profileRoutes = require('./routes/profile.routes')
const exercisesRoutes = require('./routes/exercises.routes')
const routinesRoutes = require('./routes/routines.routes')
const sessionRoutes = require('./routes/session.routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// Rutas existentes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)

// Rutas nuevas
app.use('/api/exercises', exercisesRoutes)
app.use('/api/routines', routinesRoutes)
app.use('/api/sessions', sessionRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})