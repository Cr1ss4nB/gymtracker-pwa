const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth.middleware')
const {
  getRoutines,
  getTemplates,
  getActiveRoutine,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  useTemplate,
  activateRoutine,
  getRoutineExercises,
  addExercise,
  updateExercise,
  removeExercise,
  getFavorites,
  toggleFavorite
} = require('../controllers/routines.controller')


router.get('/templates', verifyToken, getTemplates)
router.post('/templates/:templateId/use', verifyToken, useTemplate)

router.get('/active', verifyToken, getActiveRoutine)

router.get('/favorites', verifyToken, getFavorites)
router.put('/favorites/:id/toggle', verifyToken, toggleFavorite)

router.put('/exercises/:routineExerciseId', verifyToken, updateExercise)
router.delete('/exercises/:routineExerciseId', verifyToken, removeExercise)

router.get('/', verifyToken, getRoutines)
router.post('/', verifyToken, createRoutine)

router.get('/:id', verifyToken, getRoutineById)
router.put('/:id', verifyToken, updateRoutine)
router.delete('/:id', verifyToken, deleteRoutine)
router.put('/:id/activate', verifyToken, activateRoutine)
router.get('/:id/exercises', verifyToken, getRoutineExercises)
router.post('/:id/exercises', verifyToken, addExercise)

module.exports = router
