const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const profileRoutes = require('./routes/profile.routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})