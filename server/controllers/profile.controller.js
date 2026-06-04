const supabase = require('../config/db')

const calculateIMC = (weight, height) => {
  return (weight / ((height / 100) ** 2)).toFixed(2)
}

const calculateAge = (birthDateStr) => {
  const [year, month, day] = birthDateStr.split('-').map(Number)
  const today = new Date()
  let age = today.getFullYear() - year
  const monthDiff = today.getMonth() + 1 - month
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age--
  }
  return age
}

// GET /api/profile

const getProfile = async (req, res) => {
  const userId = req.user.id

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, age, height, weight, imc, birth_date, created_at')
    .eq('id', userId)
    .single()

  if (error) return res.status(404).json({ error: 'Perfil no encontrado' })
  res.json(data)
}

// PUT /api/profile

const createOrUpdateProfile = async (req, res) => {
  const userId = req.user.id
  const { dateOfBirth, height, weight } = req.body

  if (!dateOfBirth || !height || !weight) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateOfBirth)) {
    return res.status(400).json({ error: 'Formato de fecha inválido (esperado: YYYY-MM-DD)' })
  }

  if (height < 140 || height > 220) {
    return res.status(400).json({ error: 'Altura debe estar entre 140 y 220 cm' })
  }
  if (weight < 30 || weight > 300) {
    return res.status(400).json({ error: 'Peso debe estar entre 30 y 300 kg' })
  }

  const age = calculateAge(dateOfBirth)

  if (age < 13 || age > 100) {
    return res.status(400).json({ error: 'Edad debe estar entre 13 y 100 años' })
  }

  const imc = calculateIMC(weight, height)

  const { data, error } = await supabase
    .from('users')
    .update({
      birth_date: dateOfBirth,  
      age,                       
      height,
      weight,
      imc
    })
    .eq('id', userId)
    .select('id, name, email, age, height, weight, imc, birth_date')
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

module.exports = { getProfile, createOrUpdateProfile }
