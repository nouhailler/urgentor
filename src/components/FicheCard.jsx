import { Link } from 'react-router-dom'
import { getCategorieById, DANGER_COLORS } from '../data/categories'
import NRBCBadge from './NRBCBadge'

export default function FicheCard({ fiche }) {
  const categorie = getCategorieById(fiche.categorie)
  const dangerColor = DANGER_COLORS[fiche.niveauDanger] ?? '#F39C12'
  const isNRBC = fiche.categorie === 'nrbc'
  const isChimique = fiche.categorie === 'chimique'

  return (
    <Link
      to={`/fiche/${fiche.id}`}
      className="block group"
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          backgroundColor: '#16213e',
          borderLeft: `4px solid ${categorie?.couleur ?? '#CC0000'}`,
          transition: 'transform 0.1s, box-shadow 0.1s'
        }}
        className="rounded-lg p-5 h-full flex flex-col gap-3 hover:scale-[1.01] hover:shadow-xl cursor-pointer border border-gray-800"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{categorie?.icone}</span>
            <h3
              style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0', fontSize: '18px' }}
              className="font-semibold leading-tight"
            >
              {fiche.titre}
            </h3>
          </div>
          {isNRBC && fiche.nrbc?.type && (
            <NRBCBadge type={fiche.nrbc.type} />
          )}
        </div>

        {/* Objectif */}
        <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.5' }} className="flex-1">
          {fiche.objectif}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {fiche.tags?.slice(0, 3).map(tag => (
              <span
                key={tag}
                style={{ backgroundColor: '#1e2a4a', color: '#9ca3af', fontSize: '11px' }}
                className="px-2 py-0.5 rounded-full border border-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {(isChimique || isNRBC) && (
              <span style={{ color: '#CC0000', fontSize: '11px' }} className="font-mono font-bold">
                EPI REQ.
              </span>
            )}
            <span
              style={{ backgroundColor: dangerColor + '22', color: dangerColor, fontSize: '11px', borderColor: dangerColor }}
              className="px-2 py-0.5 rounded-full font-semibold border"
            >
              {fiche.niveauDanger?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
