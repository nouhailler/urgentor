export default function DiagramVisuel({ arbresDecision }) {
  if (!arbresDecision || arbresDecision.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {arbresDecision.map((noeud, i) => (
        <div key={i} className="flex gap-0 items-stretch">
          {/* Condition */}
          <div
            style={{
              backgroundColor: '#1a1a3a',
              borderLeft: '4px solid #F39C12',
              minWidth: 0,
              flex: 1
            }}
            className="rounded-l-lg p-4"
          >
            <div style={{ color: '#F39C12', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace' }} className="mb-1 uppercase tracking-wider">
              SI
            </div>
            <div style={{ color: '#f0f0f0', fontSize: '15px' }}>
              {noeud.condition}
            </div>
          </div>

          {/* Arrow */}
          <div
            style={{ backgroundColor: '#F39C12', minWidth: '36px' }}
            className="flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <path d="M10 3l7 7-7 7M3 10h14" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Action */}
          <div
            style={{
              backgroundColor: '#0a2a1a',
              borderRight: '4px solid #2ECC71',
              flex: 1,
              minWidth: 0
            }}
            className="rounded-r-lg p-4"
          >
            <div style={{ color: '#2ECC71', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace' }} className="mb-1 uppercase tracking-wider">
              ALORS
            </div>
            <div style={{ color: '#f0f0f0', fontSize: '15px' }}>
              {noeud.alors}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
