const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth.middleware')
const { getExercises, getExerciseById } = require('../controllers/exercises.controller')

// GET /api/exercises — catálogo completo con filtros opcionales
router.get('/', verifyToken, getExercises)

// GET /api/exercises/:id — detalle de un ejercicio
router.get('/:id', verifyToken, getExerciseById)

module.exports = router
