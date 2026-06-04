const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth.middleware')
const {
  getRoutines,
  getTemplates,
  getActiveRoutine,
  getFavorites,
  toggleFavorite,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  useTemplate,
  activateRoutine,
  getRoutineExercises,
  addExercise,
  updateExercise,
  removeExercise
} = require('../controllers/routines.controller')

// Rutas con segmentos literales — siempre ANTES de los dinámicos

// Templates
router.get('/templates', verifyToken, getTemplates)
router.post('/templates/:templateId/use', verifyToken, useTemplate)

// Rutina activa
router.get('/active', verifyToken, getActiveRoutine)

// Favoritos
router.get('/favorites', verifyToken, getFavorites)
router.put('/favorites/:id/toggle', verifyToken, toggleFavorite)

// Operaciones sobre un routine_exercise por su propio ID
router.put('/exercises/:routineExerciseId', verifyToken, updateExercise)
router.delete('/exercises/:routineExerciseId', verifyToken, removeExercise)

// Colección base
router.get('/', verifyToken, getRoutines)
router.post('/', verifyToken, createRoutine)

// Rutas con :id dinámico — AL FINAL para no colisionar 
router.get('/:id', verifyToken, getRoutineById)
router.put('/:id', verifyToken, updateRoutine)
router.delete('/:id', verifyToken, deleteRoutine)
router.put('/:id/activate', verifyToken, activateRoutine)
router.get('/:id/exercises', verifyToken, getRoutineExercises)
router.post('/:id/exercises', verifyToken, addExercise)

module.exports = router
