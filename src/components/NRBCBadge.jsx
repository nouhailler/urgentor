// Couleur d'accent par type NRBC (teinte douce, lisible sur fond clair)
const NRBC_CONFIG = {
  N: { color: '#B08A1E', icone: '☢️', label: 'NUCLÉAIRE' },
  R: { color: '#B08A1E', icone: '☢️', label: 'RADIOLOGIQUE' },
  B: { color: '#2F8F6B', icone: '🦠', label: 'BIOLOGIQUE' },
  C: { color: '#7A5AA6', icone: '☣️', label: 'CHIMIQUE' }
}

const EPI_COLORS = {
  'EPI niveau 1': '#1E8A5A',
  'EPI niveau 2': '#B5740A',
  'EPI niveau 3': '#D2762E',
  'EPI niveau 4': '#C8102E'
}

export default function NRBCBadge({ type, niveauEPI, className = '' }) {
  const config = NRBC_CONFIG[type]
  if (!config) return null

  const epiColor = Object.entries(EPI_COLORS).find(([k]) => niveauEPI?.includes(k))?.[1] ?? '#C8102E'

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        style={{
          backgroundColor: `${config.color}1A`,
          color: config.color,
          border: `1px solid ${config.color}40`,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.5px',
        }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium"
      >
        <span style={{ fontSize: '13px' }}>{config.icone}</span>
        <span>{type} — {config.label}</span>
      </div>
      {niveauEPI && (
        <span
          style={{ color: epiColor, borderColor: `${epiColor}40`, fontFamily: "'IBM Plex Mono', monospace" }}
          className="text-[11px] border px-2 py-0.5 rounded-full"
        >
          {niveauEPI.split('—')[0].trim()}
        </span>
      )}
    </div>
  )
}
