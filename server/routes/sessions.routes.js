const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth.middleware')
const {
  startSession,
  finishSession,
  cancelSession,
  getActiveSession,
  getSessionHistory,
  getSessionById,
  addLog
} = require('../controllers/sessions.controller')

router.get('/active', verifyToken, getActiveSession)
router.get('/history', verifyToken, getSessionHistory)

router.post('/start', verifyToken, startSession)

router.get('/:id', verifyToken, getSessionById)
router.post('/:id/finish', verifyToken, finishSession)
router.post('/:id/cancel', verifyToken, cancelSession)
router.post('/:id/logs', verifyToken, addLog)

module.exports = router
