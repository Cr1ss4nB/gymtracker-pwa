const DB_NAME = 'gymtracker'
const DB_VERSION = 1

const STORES = {
  exercises: { keyPath: 'id' },
  routines: { keyPath: 'id' },
  sessions: { keyPath: 'id' },
  pending_sync: { keyPath: 'id', autoIncrement: true },
  workout_logs: { keyPath: 'id', autoIncrement: true },
  user_settings: { keyPath: 'key' },
  location_history: { keyPath: 'id', autoIncrement: true },
  pending_validations: { keyPath: 'id', autoIncrement: true }
}

const INDEXES = {
  exercises: [
    { name: 'by_muscle', keyPath: 'muscle_group' },
    { name: 'by_category', keyPath: 'category' }
  ],
  routines: [
    { name: 'by_user', keyPath: 'user_id' },
    { name: 'by_active', keyPath: 'is_active' }
  ],
  sessions: [
    { name: 'by_user', keyPath: 'user_id' },
    { name: 'by_date', keyPath: 'started_at' },
    { name: 'by_routine', keyPath: 'routine_id' }
  ],
  pending_sync: [
    { name: 'by_type', keyPath: 'type' },
    { name: 'by_status', keyPath: 'status' }
  ],
  pending_validations: [
    { name: 'by_session', keyPath: 'session_id' },
    { name: 'by_status', keyPath: 'status' }
  ],
  location_history: [
    { name: 'by_session', keyPath: 'session_id' }
  ]
}

// ─── ABRIR DB ──────────────────────────────────────────────
export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      console.log('[IDB] Creando/actualizando base de datos...')

      Object.entries(STORES).forEach(([storeName, options]) => {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, options)
          console.log(`[IDB] Store creado: ${storeName}`)

          const indexes = INDEXES[storeName] || []
          indexes.forEach(({ name, keyPath }) => {
            store.createIndex(name, keyPath, { unique: false })
          })
        }
      })
    }

    request.onsuccess = (event) => {
      console.log('[IDB] Base de datos abierta correctamente')
      resolve(event.target.result)
    }

    request.onerror = (event) => {
      console.error('[IDB] Error al abrir la base de datos:', event.target.error)
      reject(event.target.error)
    }
  })
}

// ─── HELPERS CRUD ──────────────────────────────────────────

export const idbPut = async (storeName, data) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const request = store.put(data)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const idbGet = async (storeName, key) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const request = store.get(key)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const idbGetAll = async (storeName) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const idbGetByIndex = async (storeName, indexName, value) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const index = store.index(indexName)
    const request = index.getAll(value)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const idbDelete = async (storeName, key) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const request = store.delete(key)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const idbClear = async (storeName) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const request = store.clear()
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const idbCount = async (storeName) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const request = store.count()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Auto-init al importar el módulo
openDB().catch(err => console.error('[IDB] Fallo en auto-init:', err))