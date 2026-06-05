const VAPID_PUBLIC_KEY_URL = '/api/push/vapid-public-key'
const SUBSCRIBE_URL = '/api/push/subscribe'
const UNSUBSCRIBE_URL = '/api/push/unsubscribe'

const getToken = () => localStorage.getItem('token')

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Pedir permiso y suscribirse
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('[Push] Este navegador no soporta notificaciones')
    return false
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('[Push] Service Worker no disponible')
    return false
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('[Push] Permiso de notificaciones denegado')
      return false
    }

    console.log('[Push] Permiso concedido')
    await subscribeToPush()
    return true
  } catch (err) {
    console.error('[Push] Error solicitando permiso:', err)
    return false
  }
}

// Suscribirse al servicio push
export const subscribeToPush = async () => {
  try {
    const token = getToken()
    if (!token) return false

    // Obtener clave pública del servidor
    const res = await fetch(VAPID_PUBLIC_KEY_URL)
    const { publicKey } = await res.json()

    // Obtener el SW registrado
    const registration = await navigator.serviceWorker.ready

    // Suscribirse
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    })

    // Enviar suscripción al servidor
    await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ subscription })
    })

    console.log('[Push] Suscripción exitosa')
    localStorage.setItem('push_subscribed', 'true')
    return true
  } catch (err) {
    console.error('[Push] Error al suscribirse:', err)
    return false
  }
}

// Cancelar suscripción
export const unsubscribeFromPush = async () => {
  try {
    const token = getToken()
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()
      await fetch(UNSUBSCRIBE_URL, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
    }

    localStorage.removeItem('push_subscribed')
    console.log('[Push] Suscripción cancelada')
    return true
  } catch (err) {
    console.error('[Push] Error al cancelar suscripción:', err)
    return false
  }
}

// Verificar si ya está suscrito
export const isSubscribed = async () => {
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    return !!subscription
  } catch {
    return false
  }
}

// Verificar si el permiso está concedido
export const hasNotificationPermission = () => {
  return Notification.permission === 'granted'
}