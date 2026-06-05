const express = require('express')
const router = express.Router()
const { verifyToken: auth } = require('../middleware/auth.middleware')
const {
  subscribe,
  unsubscribe,
  sendReminder,
  sendRutinaCompletada,
  broadcast,
  getVapidPublicKey
} = require('../controllers/push.controller')

// Pública — el cliente la necesita antes de suscribirse
router.get('/vapid-public-key', getVapidPublicKey)

// Protegidas
router.post('/subscribe', auth, subscribe)
router.delete('/unsubscribe', auth, unsubscribe)
router.post('/reminder', auth, sendReminder)
router.post('/rutina-completada', auth, sendRutinaCompletada)
router.post('/broadcast', auth, broadcast)

module.exports = router