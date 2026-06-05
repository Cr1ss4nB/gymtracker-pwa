const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth.middleware')
const { getSummary, getStreak, getHistory } = require('../controllers/progress.controller')

router.get('/summary', verifyToken, getSummary)
router.get('/streak',  verifyToken, getStreak)
router.get('/history', verifyToken, getHistory)

module.exports = router
