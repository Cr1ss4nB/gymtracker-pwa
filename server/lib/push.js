const webpush = require('web-push')

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

// Suscripciones en memoria por ahora
// En producción esto iría en Supabase
const subscriptions = new Map()

const saveSubscription = (userId, subscription) => {
  subscriptions.set(userId, subscription)
  console.log(`[Push] Suscripción guardada para usuario: ${userId}`)
}

const getSubscription = (userId) => {
  return subscriptions.get(userId)
}

const removeSubscription = (userId) => {
  subscriptions.delete(userId)
}

const sendNotification = async (userId, payload) => {
  const subscription = getSubscription(userId)
  if (!subscription) {
    console.warn(`[Push] No hay suscripción para usuario: ${userId}`)
    return false
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
    console.log(`[Push] Notificación enviada a: ${userId}`)
    return true
  } catch (err) {
    if (err.statusCode === 410) {
      // Suscripción expirada
      removeSubscription(userId)
      console.warn(`[Push] Suscripción expirada, eliminada: ${userId}`)
    } else {
      console.error(`[Push] Error enviando notificación:`, err.message)
    }
    return false
  }
}

const sendToAll = async (payload) => {
  const results = []
  for (const [userId] of subscriptions) {
    const result = await sendNotification(userId, payload)
    results.push({ userId, success: result })
  }
  return results
}

// Notificaciones predefinidas para GymTracker
const notifications = {
  recordatorio: (dia) => ({
    title: '💪 GymTracker',
    body: `Hoy toca entrenar — ${dia}. ¡Vamos!`,
    url: '/dashboard'
  }),
  rutinaCompletada: () => ({
    title: '🏆 ¡Rutina completada!',
    body: 'Buen trabajo. Completaste tu entrenamiento de hoy.',
    url: '/progreso'
  }),
  validacionPendiente: () => ({
    title: '📸 GymTracker',
    body: 'Tienes una validación pendiente. Súbela ahora.',
    url: '/sesion'
  }),
  motivacional: () => ({
    title: '🔥 GymTracker',
    body: 'No abandones el proceso. Cada sesión cuenta.',
    url: '/dashboard'
  })
}

module.exports = {
  saveSubscription,
  getSubscription,
  removeSubscription,
  sendNotification,
  sendToAll,
  notifications
}