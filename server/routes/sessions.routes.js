const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth.middleware')
const {
  startSession,
  finishSession,
  cancelSession,
  getActiveSession,
  getSessionHistory,
  getWeeklySessions,
  getSessionById,
  addLog,
  saveLocation
} = require('../controllers/sessions.controller')

router.post('/location', verifyToken, saveLocation)
router.get('/active', verifyToken, getActiveSession)
router.get('/history', verifyToken, getSessionHistory)
router.get('/weekly', verifyToken, getWeeklySessions)

router.post('/start', verifyToken, startSession)

router.get('/:id', verifyToken, getSessionById)
router.post('/:id/finish', verifyToken, finishSession)
router.post('/:id/cancel', verifyToken, cancelSession)
router.post('/:id/logs', verifyToken, addLog)

module.exports = router
