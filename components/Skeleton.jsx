const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = '6px',
  variant = null,
  style = {}
}) => {
  const variants = {
    card: { width: '100%', height: '220px', borderRadius: '12px' },
    text: { width: '100%', height: '16px', borderRadius: '4px' },
    'text-short': { width: '60%', height: '16px', borderRadius: '4px' },
    badge: { width: '80px', height: '24px', borderRadius: '20px' },
  }

  const computed = variant ? variants[variant] || {} : { width, height, borderRadius }

  return (
    <div
      className="skeleton"
      style={{ ...computed, ...style }}
      aria-hidden="true"
    />
  )
}

export const SkeletonExerciseCard = () => (
  <div className="exercise-card skeleton-card">
    <Skeleton variant="card" style={{ height: '140px', borderRadius: '10px 10px 0 0' }} />
    <div className="exercise-card__body" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <Skeleton width="75%" height="18px" borderRadius="4px" />
      <Skeleton width="50%" height="14px" borderRadius="4px" />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
        <Skeleton variant="badge" />
        <Skeleton variant="badge" />
      </div>
    </div>
  </div>
)

export default Skeleton
