import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getFavorites, toggleFavorite, activateRoutine, deleteRoutine } from '../../js/routines/routines.api'
import { useRoutineContext } from '../../contexts/RoutineContext'
import RoutineCard from '../../components/RoutineCard'
import ConfirmDialog from '../../components/ConfirmDialog'
import './favorites.css'

const Favorites = () => {
  const token = localStorage.getItem('token')
  const { fetchActiveRoutine } = useRoutineContext()

  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Estado para el ConfirmDialog de activar
  const [confirmActivate, setConfirmActivate] = useState(null) // rutina pendiente de activar
  // Estado para el ConfirmDialog de eliminar
  const [confirmDelete, setConfirmDelete] = useState(null) // rutina pendiente de eliminar

  const [favLoading, setFavLoading] = useState(null) // id de la rutina cuyo fav se está procesando
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  // ── Carga inicial ──────────────────────────────────────────────────────────
  const loadFavorites = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getFavorites(token)
      setFavorites(res.data || [])
    } catch (err) {
      setError(err.message || 'Error al cargar favoritos')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  // ── Toggle favorito ────────────────────────────────────────────────────────
  const handleToggleFav = useCallback(async (routine) => {
    setFavLoading(routine.id)
    setActionError('')
    try {
      await toggleFavorite(token, routine.id)
      // Al quitar favorito desde esta página, se elimina de la lista localmente
      setFavorites(prev => prev.filter(r => r.id !== routine.id))
    } catch (err) {
      setActionError(err.message || 'Error al actualizar favorito')
    } finally {
      setFavLoading(null)
    }
  }, [token])

  // ── Activar rutina — pide confirmación ────────────────────────────────────
  const handleActivateRequest = useCallback((routine) => {
    setConfirmActivate(routine)
  }, [])

  const handleActivateConfirm = useCallback(async () => {
    if (!confirmActivate) return
    setActionLoading(true)
    setActionError('')
    try {
      await activateRoutine(token, confirmActivate.id)
      // Refrescar RoutineContext para sincronizar el board de /rutinas
      await fetchActiveRoutine()
      // Actualizar lista local: marcar la nueva activa y desmarcar las demás
      setFavorites(prev =>
        prev.map(r => ({ ...r, is_active: r.id === confirmActivate.id }))
      )
    } catch (err) {
      setActionError(err.message || 'Error al activar rutina')
    } finally {
      setActionLoading(false)
      setConfirmActivate(null)
    }
  }, [token, confirmActivate, fetchActiveRoutine])

  // ── Eliminar rutina — pide confirmación ───────────────────────────────────
  const handleDeleteRequest = useCallback((routine) => {
    setConfirmDelete(routine)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!confirmDelete) return
    setActionLoading(true)
    setActionError('')
    try {
      await deleteRoutine(token, confirmDelete.id)
      // Si era la activa, limpiar contexto
      if (confirmDelete.is_active) {
        await fetchActiveRoutine()
      }
      setFavorites(prev => prev.filter(r => r.id !== confirmDelete.id))
    } catch (err) {
      setActionError(err.message || 'Error al eliminar rutina')
    } finally {
      setActionLoading(false)
      setConfirmDelete(null)
    }
  }, [token, confirmDelete, fetchActiveRoutine])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="favorites-page">
      {/* Encabezado */}
      <div className="favorites-header">
        <div>
          <h1 className="favorites-title">Favoritos</h1>
          <p className="favorites-subtitle">Tus rutinas guardadas</p>
        </div>
        <Link to="/rutinas" className="favorites-back-btn">
          ← Volver a rutinas
        </Link>
      </div>

      {/* Error de acción */}
      {actionError && (
        <div className="favorites-action-error">⚠️ {actionError}</div>
      )}

      {/* Error de carga */}
      {error && !loading && (
        <div className="favorites-error">
          <span>⚠️ {error}</span>
          <button onClick={loadFavorites} type="button">Reintentar</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="favorites-loading">
          <div className="favorites-loading__spinner" />
          <span>Cargando favoritos...</span>
        </div>
      )}

      {/* Grid de favoritos */}
      {!loading && favorites.length > 0 && (
        <div className="favorites-grid">
          {favorites.map(routine => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onToggleFav={handleToggleFav}
              onActivate={handleActivateRequest}
              onDelete={handleDeleteRequest}
              favLoading={favLoading === routine.id}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && favorites.length === 0 && !error && (
        <div className="favorites-empty">
          <span className="favorites-empty__icon">⭐</span>
          <h2 className="favorites-empty__title">Sin favoritos todavía</h2>
          <p className="favorites-empty__sub">
            Marca una rutina con ★ para guardarla aquí y acceder rápidamente.
          </p>
          <Link to="/rutinas" className="favorites-empty__link">
            Ir a mis rutinas
          </Link>
        </div>
      )}

      {/* ConfirmDialog — Activar */}
      <ConfirmDialog
        isOpen={!!confirmActivate}
        title="¿Cambiar rutina activa?"
        message={
          confirmActivate
            ? `Se desactivará tu rutina actual y se activará "${confirmActivate.name}". ¿Continuar?`
            : ''
        }
        confirmLabel={actionLoading ? 'Activando...' : 'Activar'}
        cancelLabel="Cancelar"
        onConfirm={handleActivateConfirm}
        onCancel={() => setConfirmActivate(null)}
      />

      {/* ConfirmDialog — Eliminar */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="¿Eliminar rutina?"
        message={
          confirmDelete
            ? `Se eliminarán todos los ejercicios de "${confirmDelete.name}". Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel={actionLoading ? 'Eliminando...' : 'Eliminar'}
        cancelLabel="Cancelar"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}

export default Favorites
