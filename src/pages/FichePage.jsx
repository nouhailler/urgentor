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
      <main className="mx-auto px-4 py-10 text-center w-full" style={{ maxWidth: '780px' }}>
        <div className="text-6xl mb-4">❓</div>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '28px', fontWeight: 700 }}>
          Fiche introuvable
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>L'identifiant « {id} » ne correspond à aucune fiche.</p>
        <Link to="/" style={{ color: 'var(--accent)', marginTop: '16px', display: 'inline-block', fontSize: '16px' }}>
          ← Retour à la bibliothèque
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto px-4 py-6 w-full" style={{ maxWidth: '780px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '18px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        Retour à la bibliothèque
      </button>

      <FicheDetail fiche={fiche} />
    </main>
  )
}
