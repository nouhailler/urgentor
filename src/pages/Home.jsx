import { Link } from 'react-router-dom'
import { useFiches } from '../hooks/useFiches'
import SearchBar from '../components/SearchBar'
import FicheCard from '../components/FicheCard'
import { CATEGORIES } from '../data/categories'

// Convertit un hex en rgba avec alpha — pour les fonds de chips actifs
function withAlpha(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function Home() {
  const { fichesFiltrees, allFiches, query, setQuery, categorieActive, setCategorieActive } = useFiches()

  const toggleCategorie = (id) => {
    setCategorieActive(prev => prev === id ? null : id)
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-7 w-full flex-1">
      {/* En-tête */}
      <div className="mb-6">
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }} className="uppercase">
          Bibliothèque
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '30px', fontWeight: 700, letterSpacing: '-0.3px', margin: 0 }}>
          Fiches de premiers secours
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>
          {fichesFiltrees.length} fiche{fichesFiltrees.length > 1 ? 's' : ''} prête{fichesFiltrees.length > 1 ? 's' : ''} à l'emploi, utilisable{fichesFiltrees.length > 1 ? 's' : ''} hors ligne.
        </p>
      </div>

      {/* Recherche */}
      <div className="mb-5">
        <SearchBar value={query} onChange={setQuery} allFiches={allFiches} />
      </div>

      {/* Filtres catégories */}
      <div className="flex flex-wrap gap-2 mb-7">
        {CATEGORIES.map(cat => {
          const active = categorieActive === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => toggleCategorie(cat.id)}
              style={{
                backgroundColor: active ? withAlpha(cat.couleur, 0.14) : 'var(--surface)',
                border: `${active ? 1.5 : 1}px solid ${active ? cat.couleur : 'var(--border)'}`,
                color: active ? cat.couleur : 'var(--text-body)',
                fontSize: '13.5px',
                fontWeight: active ? 600 : 500,
                minHeight: '42px',
              }}
              className="flex items-center gap-2 px-4 rounded-full transition-colors"
            >
              <span style={{ fontSize: '15px' }}>{cat.icone}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          )
        })}
        {categorieActive && (
          <button
            onClick={() => setCategorieActive(null)}
            style={{ backgroundColor: 'var(--chip-bg)', color: 'var(--chip-text)', fontSize: '13px', minHeight: '42px', border: '1px solid var(--border)' }}
            className="px-4 rounded-full hover:bg-[var(--divider)] transition-colors"
          >
            ✕ Effacer
          </button>
        )}
      </div>

      {/* Grille de fiches */}
      {fichesFiltrees.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Aucune fiche trouvée pour « {query} »</div>
          <button onClick={() => { setQuery(''); setCategorieActive(null) }} style={{ color: 'var(--accent)', marginTop: '12px', fontSize: '15px', background: 'none', border: 'none', cursor: 'pointer' }}>
            Effacer les filtres
          </button>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(296px, 1fr))' }}>
          {fichesFiltrees.map(fiche => (
            <FicheCard key={fiche.id} fiche={fiche} />
          ))}
        </div>
      )}

      {/* FAB Nouvelle fiche (mobile) */}
      <Link
        to="/nouvelle-fiche"
        style={{
          backgroundColor: 'var(--brand)',
          width: '58px',
          height: '58px',
          bottom: 'calc(20px + env(safe-area-inset-bottom))',
          right: '20px',
          boxShadow: 'var(--shadow-fab)',
        }}
        className="fixed rounded-full flex items-center justify-center text-white hover:brightness-110 transition-all z-40 sm:hidden"
        title="Nouvelle fiche"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </Link>
    </main>
  )
}
