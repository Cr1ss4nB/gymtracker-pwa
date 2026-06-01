const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth.middleware')

// Los controllers se implementan en la rama feature/rutinas
// Por ahora responden 200 para que el servidor compile sin errores

router.get('/', verifyToken, (req, res) => {
    res.json({ data: [], message: 'Módulo rutinas en construcción' })
})

router.get('/templates', verifyToken, (req, res) => {
    res.json({ data: [], message: 'Módulo rutinas en construcción' })
})

router.get('/favorites', verifyToken, (req, res) => {
    res.json({ data: [], message: 'Módulo rutinas en construcción' })
})

router.post('/', verifyToken, (req, res) => {
    res.status(501).json({ message: 'Módulo rutinas en construcción' })
})

router.put('/:id', verifyToken, (req, res) => {
    res.status(501).json({ message: 'Módulo rutinas en construcción' })
})

router.delete('/:id', verifyToken, (req, res) => {
    res.status(501).json({ message: 'Módulo rutinas en construcción' })
})

router.get('/:id/exercises', verifyToken, (req, res) => {
    res.json({ data: [], message: 'Módulo rutinas en construcción' })
})

router.post('/:id/exercises', verifyToken, (req, res) => {
    res.status(501).json({ message: 'Módulo rutinas en construcción' })
})

router.put('/exercises/:routineExerciseId', verifyToken, (req, res) => {
    res.status(501).json({ message: 'Módulo rutinas en construcción' })
})

router.delete('/exercises/:routineExerciseId', verifyToken, (req, res) => {
    res.status(501).json({ message: 'Módulo rutinas en construcción' })
})

router.post('/:id/favorite', verifyToken, (req, res) => {
    res.status(501).json({ message: 'Módulo rutinas en construcción' })
})

module.exports = router
