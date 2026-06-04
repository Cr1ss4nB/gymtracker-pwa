import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getFavorites, activateRoutine, deleteRoutine } from '../../js/routines/routines.api'
import { useRoutineContext } from '../../contexts/RoutineContext'
import RoutineCard from '../../components/RoutineCard'
import ConfirmDialog from '../../components/ConfirmDialog'
import './favorites.css'

const Favorites = () => {
  const { fetchActiveRoutine } = useRoutineContext()

  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const [confirmActivate, setConfirmActivate] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const loadFavorites = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getFavorites()
      setFavorites(res.data || [])
    } catch (err) {
      setError(err.message || 'Error al cargar favoritos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const handleActivateConfirm = useCallback(async () => {
    if (!confirmActivate) return
    setActionLoading(true)
    setActionError('')
    try {
      await activateRoutine(confirmActivate.id)
      await fetchActiveRoutine()
      setFavorites(prev =>
        prev.map(r => ({ ...r, is_active: r.id === confirmActivate.id }))
      )
    } catch (err) {
      setActionError(err.message || 'Error al activar rutina')
    } finally {
      setActionLoading(false)
      setConfirmActivate(null)
    }
  }, [confirmActivate, fetchActiveRoutine])

  const handleDeleteConfirm = useCallback(async () => {
    if (!confirmDelete) return
    setActionLoading(true)
    setActionError('')
    try {
      await deleteRoutine(confirmDelete.id)
      setFavorites(prev => prev.filter(r => r.id !== confirmDelete.id))
      if (confirmDelete.is_active) {
        await fetchActiveRoutine()
      }
    } catch (err) {
      setActionError(err.message || 'Error al eliminar rutina')
    } finally {
      setActionLoading(false)
      setConfirmDelete(null)
    }
  }, [confirmDelete, fetchActiveRoutine])

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div>
          <h1 className="favorites-title">Favoritos</h1>
          <p className="favorites-subtitle">Tus rutinas guardadas</p>
        </div>
        <Link to="/rutinas" className="favorites-back-btn">
          ← Volver a rutinas
        </Link>
      </div>

      {actionError && (
        <div className="favorites-action-error">⚠️ {actionError}</div>
      )}

      {error && !loading && (
        <div className="favorites-error">
          <span>⚠️ {error}</span>
          <button onClick={loadFavorites} type="button">Reintentar</button>
        </div>
      )}

      {loading && (
        <div className="favorites-loading">
          <div className="favorites-loading__spinner" />
          <span>Cargando favoritos...</span>
        </div>
      )}

      {!loading && favorites.length > 0 && (
        <div className="favorites-grid">
          {favorites.map(routine => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onActivate={(r) => setConfirmActivate(r)}
              onDelete={(r) => setConfirmDelete(r)}
            />
          ))}
        </div>
      )}

      {!loading && favorites.length === 0 && !error && (
        <div className="favorites-empty">
          <span className="favorites-empty__icon">⭐</span>
          <h2 className="favorites-empty__title">Sin favoritos todavía</h2>
          <p className="favorites-empty__sub">
            En /rutinas pulsa ★ para guardar una rutina aquí como copia independiente.
          </p>
          <Link to="/rutinas" className="favorites-empty__link">
            Ir a mis rutinas
          </Link>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmActivate}
        title="¿Cambiar rutina activa?"
        message={confirmActivate
          ? `Se desactivará tu rutina actual y se activará "${confirmActivate.name}". ¿Continuar?`
          : ''}
        confirmLabel={actionLoading ? 'Activando...' : 'Activar'}
        cancelLabel="Cancelar"
        onConfirm={handleActivateConfirm}
        onCancel={() => setConfirmActivate(null)}
      />

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="¿Eliminar rutina?"
        message={confirmDelete
          ? `Se eliminarán todos los ejercicios de "${confirmDelete.name}". Esta acción no se puede deshacer.`
          : ''}
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
