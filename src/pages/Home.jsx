import { Link } from 'react-router-dom'
import { useFiches } from '../hooks/useFiches'
import SearchBar from '../components/SearchBar'
import FicheCard from '../components/FicheCard'
import { CATEGORIES } from '../data/categories'

export default function Home() {
  const { fichesFiltrees, query, setQuery, categorieActive, setCategorieActive } = useFiches()

  const toggleCategorie = (id) => {
    setCategorieActive(prev => prev === id ? null : id)
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 w-full flex-1">
      {/* Hero */}
      <div className="mb-6">
        <h1 style={{ fontFamily: 'Oswald, sans-serif', color: '#CC0000', fontSize: '32px', letterSpacing: '3px', marginBottom: '4px' }}>
          BIBLIOTHÈQUE
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '15px' }}>
          {fichesFiltrees.length} fiche{fichesFiltrees.length > 1 ? 's' : ''} disponible{fichesFiltrees.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Recherche */}
      <div className="mb-5">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Filtres catégories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => toggleCategorie(cat.id)}
            style={{
              backgroundColor: categorieActive === cat.id ? cat.couleur : '#16213e',
              borderColor: cat.couleur,
              color: categorieActive === cat.id ? (cat.id === 'nrbc' ? '#0D0D0D' : '#FFFFFF') : '#d0d0d0',
              fontSize: '14px',
              minHeight: '44px',
              fontFamily: 'IBM Plex Sans, sans-serif',
              border: `2px solid ${cat.couleur}`
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors hover:opacity-90"
          >
            <span>{cat.icone}</span>
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        ))}
        {categorieActive && (
          <button
            onClick={() => setCategorieActive(null)}
            style={{ backgroundColor: '#333', color: '#9ca3af', fontSize: '13px', minHeight: '44px' }}
            className="px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-700"
          >
            ✕ Tout
          </button>
        )}
      </div>

      {/* Grille de fiches */}
      {fichesFiltrees.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <div style={{ color: '#9ca3af', fontSize: '18px' }}>Aucune fiche trouvée pour "{query}"</div>
          <button onClick={() => { setQuery(''); setCategorieActive(null) }} style={{ color: '#CC0000', marginTop: '12px', fontSize: '15px' }}>
            Effacer les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fichesFiltrees.map(fiche => (
            <FicheCard key={fiche.id} fiche={fiche} />
          ))}
        </div>
      )}

      {/* FAB Nouvelle fiche */}
      <Link
        to="/nouvelle-fiche"
        style={{
          backgroundColor: '#CC0000',
          width: '60px',
          height: '60px',
          bottom: '24px',
          right: '24px',
          fontSize: '28px',
          boxShadow: '0 4px 20px rgba(204,0,0,0.5)'
        }}
        className="fixed rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors z-40"
        title="Nouvelle fiche"
      >
        +
      </Link>
    </main>
  )
}
