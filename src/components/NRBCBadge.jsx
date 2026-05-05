const NRBC_CONFIG = {
  N: { bg: '#0D0D0D', text: '#FFD700', border: '#FFD700', icone: '☢️', label: 'NUCLÉAIRE' },
  R: { bg: '#FFD700', text: '#0D0D0D', border: '#0D0D0D', icone: '☢️', label: 'RADIOLOGIQUE' },
  B: { bg: '#1a4a1a', text: '#FFFFFF', border: '#2ECC71', icone: '🦠', label: 'BIOLOGIQUE' },
  C: { bg: '#2d0060', text: '#FFFFFF', border: '#8B00FF', icone: '☣️', label: 'CHIMIQUE' }
}

const EPI_COLORS = {
  'EPI niveau 1': '#2ECC71',
  'EPI niveau 2': '#F39C12',
  'EPI niveau 3': '#FF6B35',
  'EPI niveau 4': '#CC0000'
}

export default function NRBCBadge({ type, niveauEPI, className = '' }) {
  const config = NRBC_CONFIG[type]
  if (!config) return null

  const epiColor = Object.entries(EPI_COLORS).find(([k]) => niveauEPI?.includes(k))?.[1] ?? '#CC0000'

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <div
        style={{
          backgroundColor: config.bg,
          color: config.text,
          border: `2px solid ${config.border}`,
          fontFamily: 'Oswald, sans-serif'
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded font-semibold text-sm tracking-widest"
      >
        <span className="text-lg">{config.icone}</span>
        <span>{type} — {config.label}</span>
      </div>
      {niveauEPI && (
        <div
          style={{ color: epiColor, borderColor: epiColor }}
          className="text-xs font-mono border px-2 py-0.5 rounded tracking-wide"
        >
          {niveauEPI.split('—')[0].trim()}
        </div>
      )}
    </div>
  )
}
