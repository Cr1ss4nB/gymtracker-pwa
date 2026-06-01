import { useState, useEffect, useCallback, useRef } from 'react'
import { getExercises } from '../../js/exercises/exercises.api'
import ExerciseCard from '../../components/ExerciseCard'
import ExerciseFilters from '../../components/ExerciseFilters'
import { SkeletonExerciseCard } from '../../components/Skeleton'
import './exercises.css'

// Clave para caché en sessionStorage
// Se invalida automáticamente al cerrar el tab (sessionStorage vs localStorage)
const CACHE_KEY = 'gymtracker_exercises_all'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos en ms

const useDebounce = (value, delay) => {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])
    return debounced
}

const INITIAL_FILTERS = {
    muscle_group: '',
    equipment: '',
    difficulty: '',
    is_home: null,
    search: '',
}

const Exercises = () => {
    const token = localStorage.getItem('token')

    const [exercises, setExercises] = useState([])
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filters, setFilters] = useState(INITIAL_FILTERS)

    const debouncedSearch = useDebounce(filters.search, 300)

    const mounted = useRef(true)
    useEffect(() => {
        mounted.current = true
        return () => { mounted.current = false }
    }, [])

    // Carga inicial de ejercicios sessionStorage cache-first
    useEffect(() => {
        const loadExercises = async () => {
            setLoading(true)
            setError('')

            try {
                // Intentar leer caché
                const cached = sessionStorage.getItem(CACHE_KEY)
                if (cached) {
                    const { data, timestamp } = JSON.parse(cached)
                    const age = Date.now() - timestamp
                    if (age < CACHE_TTL && Array.isArray(data) && data.length > 0) {
                        if (mounted.current) {
                            setExercises(data)
                            setLoading(false)
                        }
                        return
                    }
                }

                // Sin caché válido: llamar a la API sin filtros (traer todo)
                const data = await getExercises(token, {})

                // Guardar en caché
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }))

                if (mounted.current) {
                    setExercises(data)
                }
            } catch (err) {
                if (mounted.current) {
                    setError(err.message || 'Error al cargar ejercicios')
                }
            } finally {
                if (mounted.current) {
                    setLoading(false)
                }
            }
        }

        loadExercises()
    }, [token])

    useEffect(() => {
        if (exercises.length === 0) {
            setFiltered([])
            return
        }

        let result = [...exercises]

        if (filters.muscle_group) {
            result = result.filter(ex => ex.muscle_group === filters.muscle_group)
        }

        if (filters.equipment) {
            result = result.filter(ex => ex.equipment === filters.equipment)
        }

        if (filters.difficulty) {
            result = result.filter(ex => ex.difficulty === filters.difficulty)
        }

        if (filters.is_home === true) {
            result = result.filter(ex => ex.is_home === true)
        } else if (filters.is_home === false) {
            result = result.filter(ex => ex.is_gym === true && ex.is_home === false)
        }

        if (debouncedSearch.trim() !== '') {
            const term = debouncedSearch.toLowerCase()
            result = result.filter(ex =>
                ex.name.toLowerCase().includes(term) ||
                (ex.description && ex.description.toLowerCase().includes(term)) ||
                (ex.submuscles && ex.submuscles.some(s => s.toLowerCase().includes(term)))
            )
        }

        setFiltered(result)
    }, [exercises, filters.muscle_group, filters.equipment, filters.difficulty, filters.is_home, debouncedSearch])

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }, [])

    const handleReset = useCallback(() => {
        setFilters(INITIAL_FILTERS)
    }, [])

    return (
        <div className="exercises-page">
            {/* Encabezado */}
            <div className="exercises-header">
                <div>
                    <h1 className="exercises-title">Ejercicios</h1>
                    <p className="exercises-subtitle">Catálogo completo de movimientos</p>
                </div>
            </div>

            {/* Filtros */}
            <ExerciseFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
                resultCount={loading ? 0 : filtered.length}
            />

            {/* Error */}
            {error && (
                <div className="exercises-error">
                    <span>⚠️ {error}</span>
                    <button onClick={() => window.location.reload()} type="button">
                        Reintentar
                    </button>
                </div>
            )}

            {/* Grid de ejercicios */}
            <div className="exercises-grid">
                {loading ? (
                    Array.from({ length: 12 }).map((_, i) => (
                        <SkeletonExerciseCard key={i} />
                    ))
                ) : filtered.length > 0 ? (
                    filtered.map((exercise) => (
                        <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                        />
                    ))
                ) : (
                    // Estado vacío
                    <div className="exercises-empty">
                        <span className="exercises-empty__icon">🔍</span>
                        <h3>Sin resultados</h3>
                        <p>No encontramos ejercicios con esos filtros.</p>
                        <button
                            className="exercises-empty__reset"
                            onClick={handleReset}
                            type="button"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Exercises
