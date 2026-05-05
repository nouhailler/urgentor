import { useParams, Link, useNavigate } from 'react-router-dom'
import { TOUTES_FICHES } from '../data/ficheIndex'
import FicheDetail from '../components/FicheDetail'

export default function FichePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const stored = localStorage.getItem('urgentor_fiches_custom')
  const customFiches = stored ? JSON.parse(stored) : []
  const fiche = [...TOUTES_FICHES, ...customFiches].find(f => f.id === id)

  if (!fiche) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10 text-center">
        <div className="text-6xl mb-4">❓</div>
        <h1 style={{ fontFamily: 'Oswald, sans-serif', color: '#CC0000', fontSize: '28px' }}>
          Fiche introuvable
        </h1>
        <p style={{ color: '#9ca3af', marginTop: '8px' }}>L'identifiant « {id} » ne correspond à aucune fiche.</p>
        <Link to="/" style={{ color: '#CC0000', marginTop: '16px', display: 'inline-block', fontSize: '16px' }}>
          ← Retour à la bibliothèque
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 w-full">
      {/* Retour */}
      <button
        onClick={() => navigate(-1)}
        style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        className="flex items-center gap-1 hover:text-white transition-colors"
      >
        ← Retour
      </button>

      <FicheDetail fiche={fiche} />
    </main>
  )
}
