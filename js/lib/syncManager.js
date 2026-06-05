import { idbGetAll, idbDelete } from './indexeddb.js'

const BASE = '/api'

const headers = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
})

const getToken = () => localStorage.getItem('token')

// ─── PROCESAR OPERACIÓN PENDIENTE ──────────────────────────
const processPendingOperation = async (op, token) => {
  const { type, data } = op

  const routes = {
    add_exercise: () => fetch(`${BASE}/routines/${data.routineId}/exercises`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(data)
    }),
    update_exercise: () => fetch(`${BASE}/routines/exercises/${data.routineExerciseId}`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify(data)
    }),
    remove_exercise: () => fetch(`${BASE}/routines/exercises/${data.routineExerciseId}`, {
      method: 'DELETE',
      headers: headers(token)
    }),
    save_session: () => fetch(`${BASE}/sessions`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(data)
    })
  }

  const handler = routes[type]
  if (!handler) throw new Error(`Tipo desconocido: ${type}`)

  const res = await handler()
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

// ─── SINCRONIZAR TODO LO PENDIENTE ─────────────────────────
export const syncPendingData = async () => {
  const token = getToken()
  if (!token || !navigator.onLine) return

  try {
    const pending = await idbGetAll('pending_sync')
    if (!pending.length) {
      console.log('[Sync] No hay operaciones pendientes')
      return
    }

    console.log(`[Sync] Sincronizando ${pending.length} operaciones pendientes...`)

    for (const op of pending) {
      try {
        await processPendingOperation(op, token)
        await idbDelete('pending_sync', op.id)
        console.log(`[Sync] ✅ Operación ${op.type} sincronizada`)
      } catch (err) {
        console.warn(`[Sync] ❌ Falló operación ${op.type}:`, err.message)
      }
    }
  } catch (err) {
    console.error('[Sync] Error general:', err)
  }
}

// ─── ENCOLAR OPERACIÓN PARA SINCRONIZAR DESPUÉS ────────────
export const queueOperation = async (type, data) => {
  const { idbPut } = await import('./indexeddb.js')
  await idbPut('pending_sync', {
    type,
    data,
    status: 'pending',
    created_at: new Date().toISOString()
  })
  console.log(`[Sync] Operación encolada: ${type}`)
}

// ─── VERIFICAR Y SINCRONIZAR AL ARRANCAR ───────────────────
export const checkAndSyncOnStartup = async () => {
  if (!navigator.onLine) {
    console.log('[Sync] Sin conexión al arrancar — sync diferido')
    return
  }
  await syncPendingData()
}

// ─── ESCUCHAR CUANDO VUELVE INTERNET ───────────────────────
window.addEventListener('online', () => {
  console.log('[Sync] Conexión restaurada — sincronizando...')
  syncPendingData()
})

// ─── ESCUCHAR MENSAJES DEL SERVICE WORKER ──────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'SYNC_PENDING') {
      console.log('[Sync] SW pidió sincronización')
      syncPendingData()
    }
  })
}