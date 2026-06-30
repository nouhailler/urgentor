import { Link } from 'react-router-dom'
import { getCategorieById, getSeverity } from '../data/categories'
import NRBCBadge from './NRBCBadge'

export default function FicheCard({ fiche }) {
  const categorie = getCategorieById(fiche.categorie)
  const sev = getSeverity(fiche.niveauDanger)
  const isNRBC = fiche.categorie === 'nrbc'
  const isChimique = fiche.categorie === 'chimique'

  return (
    <Link to={`/fiche/${fiche.id}`} style={{ textDecoration: 'none' }} className="block">
      <div
        className="fiche-card h-full flex flex-col gap-3"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '18px 18px 16px',
        }}
      >
        {/* Top row : catégorie + sévérité */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span style={{ fontSize: '16px', color: categorie?.couleur }}>{categorie?.icone}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '10.5px', letterSpacing: '1px' }} className="uppercase truncate">
              {categorie?.label}
            </span>
          </div>
          <span
            style={{
              backgroundColor: sev.bg, color: sev.color,
              border: `1px solid ${sev.color}33`,
              fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.5px',
              padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap',
            }}
            className="uppercase font-medium"
          >
            {sev.label}
          </span>
        </div>

        {/* Titre */}
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '18px', fontWeight: 700, lineHeight: 1.25, margin: 0 }}>
          {fiche.titre}
        </h3>

        {/* Objectif */}
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.5, margin: 0 }} className="flex-1">
          {fiche.objectif}
        </p>

        {/* Footer : tags + EPI / NRBC */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {fiche.tags?.slice(0, 3).map(tag => (
              <span
                key={tag}
                style={{ backgroundColor: 'var(--chip-bg)', color: 'var(--chip-text)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '2px 8px' }}
                className="rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {(isChimique || isNRBC) && (
              <span style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '10px' }} className="font-semibold uppercase tracking-wide">
                EPI req.
              </span>
            )}
            {isNRBC && fiche.nrbc?.type && <NRBCBadge type={fiche.nrbc.type} />}
          </div>
        </div>
      </div>
    </Link>
  )
}
