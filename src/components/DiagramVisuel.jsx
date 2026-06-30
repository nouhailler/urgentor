export default function DiagramVisuel({ arbresDecision }) {
  if (!arbresDecision || arbresDecision.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {arbresDecision.map((noeud, i) => (
        <div
          key={i}
          className="flex items-stretch"
          style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-inner)', overflow: 'hidden' }}
        >
          {/* SI */}
          <div style={{ backgroundColor: 'var(--surface-subtle)', flex: 1, minWidth: 0, padding: '14px 16px' }}>
            <div style={{ color: 'var(--warning)', fontSize: '10.5px', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }} className="mb-1.5 uppercase">
              Si
            </div>
            <div style={{ color: 'var(--text)', fontSize: '14.5px', lineHeight: 1.45 }}>
              {noeud.condition}
            </div>
          </div>

          {/* Flèche */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', color: 'var(--text-muted)', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>

          {/* ALORS */}
          <div style={{ backgroundColor: 'var(--surface)', flex: 1, minWidth: 0, padding: '14px 16px', borderLeft: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--success)', fontSize: '10.5px', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }} className="mb-1.5 uppercase">
              Alors
            </div>
            <div style={{ color: 'var(--text)', fontSize: '14.5px', lineHeight: 1.45 }}>
              {noeud.alors}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
