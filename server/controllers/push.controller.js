const { saveSubscription, sendNotification, sendToAll, notifications, removeSubscription } = require('../lib/push')

// Guardar suscripción del usuario
const subscribe = async (req, res) => {
  try {
    const { subscription } = req.body
    const userId = req.user.id

    if (!subscription) {
      return res.status(400).json({ error: 'Suscripción requerida' })
    }

    saveSubscription(userId, subscription)

    // Enviar notificación de bienvenida
    await sendNotification(userId, {
      title: '✅ GymTracker',
      body: 'Notificaciones activadas correctamente.',
      url: '/dashboard'
    })

    res.json({ success: true, message: 'Suscripción guardada' })
  } catch (err) {
    console.error('[Push] Error en subscribe:', err)
    res.status(500).json({ error: 'Error al guardar suscripción' })
  }
}



const unsubscribe = async (req, res) => {
  try {
    const userId = req.user.id
    removeSubscription(userId)
    res.json({ success: true, message: 'Suscripción eliminada' })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar suscripción' })
  }
}

// Enviar notificación de recordatorio
const sendReminder = async (req, res) => {
  try {
    const userId = req.user.id
    const { dia } = req.body

    const payload = notifications.recordatorio(dia || 'hoy')
    const sent = await sendNotification(userId, payload)

    res.json({ success: sent })
  } catch (err) {
    res.status(500).json({ error: 'Error enviando recordatorio' })
  }
}

// Enviar notificación de rutina completada
const sendRutinaCompletada = async (req, res) => {
  try {
    const userId = req.user.id
    const payload = notifications.rutinaCompletada()
    const sent = await sendNotification(userId, payload)
    res.json({ success: sent })
  } catch (err) {
    res.status(500).json({ error: 'Error enviando notificación' })
  }
}

// Enviar notificación a todos (admin)
const broadcast = async (req, res) => {
  try {
    const { title, body, url } = req.body
    const results = await sendToAll({ title, body, url: url || '/dashboard' })
    res.json({ success: true, results })
  } catch (err) {
    res.status(500).json({ error: 'Error en broadcast' })
  }
}

// Obtener clave pública VAPID
const getVapidPublicKey = async (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY })
}

module.exports = {
  subscribe,
  unsubscribe,
  sendReminder,
  sendRutinaCompletada,
  broadcast,
  getVapidPublicKey
}