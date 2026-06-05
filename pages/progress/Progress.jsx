import { useState, useEffect, useCallback } from 'react'
import { getProgressSummary, getStreak, getProgressHistory } from '../../js/progress/progress.api'
import './progress.css'

const fmtDuration = (seconds) => {
    if (!seconds) return '0m'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
}

const fmtDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })
}

const deltaLabel = (pct) => {
    if (pct === null || pct === undefined) return null
    if (pct > 0) return { text: `+${pct}%`, cls: 'up' }
    if (pct < 0) return { text: `${pct}%`, cls: 'down' }
    return { text: '=', cls: 'same' }
}

const MetricCard = ({ icon, value, label, sub, delta, streakStyle }) => {
    const d = delta !== undefined ? deltaLabel(delta) : null
    return (
        <div className={`metric-card${streakStyle ? ' metric-card--streak' : ''}`}>
            {icon && <span className="metric-card__icon">{icon}</span>}
            <span className="metric-card__value">{value ?? '—'}</span>
            <span className="metric-card__label">{label}</span>
            {sub && <span className="metric-card__sub">{sub}</span>}
            {d && (
                <span className={`metric-card__delta metric-card__delta--${d.cls === 'up' ? 'up' : d.cls === 'down' ? 'down' : 'neutral'}`}>
                    {d.text} vs semana pasada
                </span>
            )}
        </div>
    )
}

const CompareSection = ({ summary }) => {
    const { this_week: tw, last_week: lw, delta } = summary

    const rows = [
        {
            label: 'Sesiones',
            thisVal: `${tw.sessions} sesión${tw.sessions !== 1 ? 'es' : ''}`,
            lastVal: `${lw.sessions} sesión${lw.sessions !== 1 ? 'es' : ''}`,
            delta: delta.sessions
        },
        {
            label: 'Volumen',
            thisVal: `${tw.volume_kg}kg`,
            lastVal: `${lw.volume_kg}kg`,
            delta: delta.volume
        },
        {
            label: 'Tiempo total',
            thisVal: fmtDuration(tw.duration_total),
            lastVal: fmtDuration(lw.duration_total),
            delta: delta.duration
        }
    ]

    return (
        <div className="progress-compare">
            <h2 className="progress-compare__title">Semana actual vs semana anterior</h2>
            <div className="compare-rows">
                {rows.map(row => {
                    const d = deltaLabel(row.delta)
                    return (
                        <div key={row.label} className="compare-row">
                            <span className="compare-row__label">{row.label}</span>
                            <div className="compare-row__weeks">
                                <span className="compare-row__this">{row.thisVal}</span>
                                <span className="compare-row__sep">vs</span>
                                <span className="compare-row__last">{row.lastVal}</span>
                            </div>
                            {d ? (
                                <span className={`compare-row__delta ${d.cls}`}>{d.text}</span>
                            ) : (
                                <span className="compare-row__delta same">Sin datos</span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const HistorySection = ({ sessions, loading, hasMore, onLoadMore }) => (
    <div className="progress-history">
        <h2 className="progress-history__title">Historial de sesiones</h2>

        {sessions.length === 0 && !loading ? (
            <div className="history-empty">
                <span className="history-empty__icon">📋</span>
                <p>Aún no tienes sesiones completadas.</p>
                <p style={{ color: '#444', fontSize: '0.82rem' }}>
                    Completa tu primer entrenamiento desde el Dashboard.
                </p>
            </div>
        ) : (
            <div className="history-list">
                {sessions.map(s => (
                    <div key={s.id} className="history-item">
                        <div className="history-item__left">
                            <span className="history-item__date">{fmtDate(s.started_at)}</span>
                            <span className="history-item__meta">
                                {fmtDuration(s.duration_seconds)} de entrenamiento
                            </span>
                        </div>
                        <div className="history-item__stats">
                            <div className="history-item__stat">
                                <span className="history-item__stat-value">{s.exercises_count ?? '—'}</span>
                                <span className="history-item__stat-label">ejercicios</span>
                            </div>
                            <div className="history-item__stat">
                                <span className="history-item__stat-value">
                                    {s.volume_kg > 0 ? `${s.volume_kg}kg` : '—'}
                                </span>
                                <span className="history-item__stat-label">volumen</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {hasMore && (
            <button
                className="progress-load-more"
                onClick={onLoadMore}
                disabled={loading}
                type="button"
            >
                {loading ? 'Cargando...' : 'Cargar más'}
            </button>
        )}
    </div>
)

const Progress = () => {
    const [summary, setSummary] = useState(null)
    const [streak, setStreak] = useState(null)
    const [history, setHistory] = useState([])
    const [histTotal, setHistTotal] = useState(0)
    const [histOffset, setHistOffset] = useState(0)
    const HIST_LIMIT = 10

    const [loading, setLoading] = useState(true)
    const [histLoading, setHistLoading] = useState(false)
    const [error, setError] = useState('')

    const loadInitial = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const [sumRes, strkRes, histRes] = await Promise.all([
                getProgressSummary(),
                getStreak(),
                getProgressHistory({ limit: HIST_LIMIT, offset: 0 })
            ])
            setSummary(sumRes.data)
            setStreak(strkRes.data.streak)
            setHistory(histRes.data || [])
            setHistTotal(histRes.total || 0)
            setHistOffset(HIST_LIMIT)
        } catch (err) {
            setError(err.message || 'Error al cargar métricas')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadInitial()
    }, [loadInitial])

    const loadMoreHistory = useCallback(async () => {
        setHistLoading(true)
        try {
            const res = await getProgressHistory({ limit: HIST_LIMIT, offset: histOffset })
            setHistory(prev => [...prev, ...(res.data || [])])
            setHistOffset(prev => prev + HIST_LIMIT)
        } catch (err) {
            setError(err.message)
        } finally {
            setHistLoading(false)
        }
    }, [histOffset])

    if (loading) {
        return (
            <div className="progress-page">
                <div className="progress-loading">
                    <div className="progress-loading__spinner" />
                    <span>Cargando métricas...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="progress-page">
                <div className="progress-error">
                    <span>⚠️ {error}</span>
                    <button onClick={loadInitial} type="button">Reintentar</button>
                </div>
            </div>
        )
    }

    const tw = summary?.this_week
    const d = summary?.delta

    return (
        <div className="progress-page">
            {/* Header */}
            <div className="progress-header">
                <h1>Progreso</h1>
                <p>Semana actual y métricas de entrenamiento</p>
            </div>

            {/* Métricas principales */}
            <div className="progress-metrics">
                <MetricCard
                    icon="🏋️"
                    value={tw?.sessions ?? 0}
                    label="Sesiones"
                    sub="esta semana"
                    delta={d?.sessions}
                />
                <MetricCard
                    icon="⚡"
                    value={tw?.volume_kg ? `${tw.volume_kg}kg` : '0kg'}
                    label="Volumen"
                    sub="esta semana"
                    delta={d?.volume}
                />
                <MetricCard
                    icon="⏱"
                    value={fmtDuration(tw?.duration_total)}
                    label="Tiempo total"
                    sub="esta semana"
                    delta={d?.duration}
                />
                <MetricCard
                    icon="📊"
                    value={fmtDuration(tw?.avg_duration)}
                    label="Promedio"
                    sub="por sesión"
                />
                <MetricCard
                    icon="🔥"
                    value={streak ?? 0}
                    label="Racha"
                    sub={`día${streak !== 1 ? 's' : ''} consecutivo${streak !== 1 ? 's' : ''}`}
                    streakStyle
                />
            </div>

            {/* Comparativa */}
            {summary && <CompareSection summary={summary} />}

            {/* Historial */}
            <HistorySection
                sessions={history}
                loading={histLoading}
                hasMore={history.length < histTotal}
                onLoadMore={loadMoreHistory}
            />
        </div>
    )
}

export default Progress
