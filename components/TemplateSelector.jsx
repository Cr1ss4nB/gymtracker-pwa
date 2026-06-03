import { useState, useEffect } from 'react'
import { getTemplates, useTemplate } from '../js/routines/routines.api'

const TYPE_LABELS = {
  FULL_BODY: 'Full Body',
  PPL: 'Push Pull Legs',
  UPPER_LOWER: 'Upper / Lower'
}

const TemplateSelector = ({ token, onSelect, onClose }) => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTemplates(token)
        setTemplates(res.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  // Agrupar templates por tipo
  const grouped = templates.reduce((acc, t) => {
    if (!acc[t.template_type]) acc[t.template_type] = []
    acc[t.template_type].push(t)
    return acc
  }, {})

  const handleApply = async () => {
    if (!selected) return
    setApplying(true)
    setError('')
    try {
      const res = await useTemplate(token, selected.id)
      onSelect(res.data)
    } catch (err) {
      setError(err.message)
      setApplying(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box template-selector" onClick={e => e.stopPropagation()}>
        <div className="modal-box__header">
          <h2 className="modal-box__title">Elige una plantilla</h2>
          <button className="modal-box__close" onClick={onClose} type="button">✕</button>
        </div>

        {error && <div className="modal-box__error">{error}</div>}

        {loading ? (
          <p className="modal-box__loading">Cargando plantillas...</p>
        ) : (
          <div className="template-selector__groups">
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type} className="template-selector__group">
                <h3 className="template-selector__group-title">{TYPE_LABELS[type] || type}</h3>
                <div className="template-selector__options">
                  {items.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className={`template-selector__option ${selected?.id === t.id ? 'selected' : ''}`}
                      onClick={() => setSelected(t)}
                    >
                      <span className="template-selector__option-name">{t.name}</span>
                      <span className="template-selector__option-days">{t.days_per_week} días / semana</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-box__footer">
          <button className="modal-box__btn modal-box__btn--cancel" onClick={onClose} type="button" disabled={applying}>
            Cancelar
          </button>
          <button
            className="modal-box__btn modal-box__btn--primary"
            onClick={handleApply}
            type="button"
            disabled={!selected || applying}
          >
            {applying ? 'Aplicando...' : 'Usar plantilla'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TemplateSelector
