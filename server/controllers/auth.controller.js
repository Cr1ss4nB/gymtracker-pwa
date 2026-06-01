const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../config/db')

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    return res.status(400).json({ error: 'El email ya está registrado' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('users')
    .insert({ name, email, password: hashedPassword })
    .select('id, name, email, age, height, weight, imc')
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  const token = jwt.sign(
    { id: data.id, email: data.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  // Devolver user completo para que el frontend pueda evaluar si el perfil está completo
  res.status(201).json({
    token,
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
      age: data.age,
      height: data.height,
      weight: data.weight,
      imc: data.imc
    }
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, name, email, password, age, height, weight, imc')
    .eq('email', email)
    .single()

  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' })
  }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) {
    return res.status(401).json({ error: 'Credenciales incorrectas' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      height: user.height,
      weight: user.weight,
      imc: user.imc
    }
  })
}

module.exports = { register, login }
