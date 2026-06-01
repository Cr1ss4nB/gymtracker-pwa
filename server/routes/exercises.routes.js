const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth.middleware')

// Los controllers se implementan en la rama feature/ejercicios
// Por ahora responden 200 para que el servidor compile sin errores

router.get('/', verifyToken, (req, res) => {
    res.json({ data: [], message: 'Módulo ejercicios en construcción' })
})

router.get('/:id', verifyToken, (req, res) => {
    res.json({ data: null, message: 'Módulo ejercicios en construcción' })
})

module.exports = router
