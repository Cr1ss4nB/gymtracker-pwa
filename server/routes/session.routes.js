const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth.middleware')

// Los controllers se implementan en la rama feature/sesiones-progreso
// Por ahora responden 200 para que el servidor compile sin errores

router.get('/', verifyToken, (req, res) => {
    res.json({ data: [], message: 'Módulo sesiones en construcción' })
})

router.get('/active', verifyToken, (req, res) => {
    res.json({ data: null, message: 'Módulo sesiones en construcción' })
})

router.post('/start', verifyToken, (req, res) => {
    res.status(501).json({ message: 'Módulo sesiones en construcción' })
})

router.put('/:id/end', verifyToken, (req, res) => {
    res.status(501).json({ message: 'Módulo sesiones en construcción' })
})

router.post('/:id/log', verifyToken, (req, res) => {
    res.status(501).json({ message: 'Módulo sesiones en construcción' })
})

router.get('/:id/logs', verifyToken, (req, res) => {
    res.json({ data: [], message: 'Módulo sesiones en construcción' })
})

router.post('/:id/validations', verifyToken, (req, res) => {
    res.status(501).json({ message: 'Módulo sesiones en construcción' })
})

module.exports = router
