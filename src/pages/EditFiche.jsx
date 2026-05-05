import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useFiches } from '../hooks/useFiches'
import { TOUTES_FICHES } from '../data/ficheIndex'

export default function EditFiche() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { saveFiche, isCustom } = useFiches()

  // Chercher dans les fiches custom d'abord, puis toutes les fiches
  const stored = localStorage.getItem('urgentor_fiches_custom')
  const customFiches = stored ? JSON.parse(stored) : []
  const allFiches = [...TOUTES_FICHES, ...customFiches]
  const fiche = allFiches.find(f => f.id === id)

  const [json, setJson] = useState('')
  const [parseError, setParseError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (fiche) {
      setJson(JSON.stringify(fiche, null, 2))
    }
  }, [id])

  if (!fiche) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10 text-center">
        <div style={{ color: '#CC0000', fontFamily: 'Oswald, sans-serif', fontSize: '24px' }}>Fiche introuvable</div>
        <Link to="/gestion" style={{ color: '#9ca3af', display: 'block', marginTop: '12px' }}>← Gestion des fiches</Link>
      </main>
    )
  }

  const handleChange = (val) => {
    setJson(val)
    setParseError('')
    setSaved(false)
    try { JSON.parse(val) }
    catch (e) { setParseError(e.message) }
  }

  const handleSave = () => {
    try {
      const parsed = JSON.parse(json)
      if (!parsed.id || !parsed.titre) throw new Error('Champs id et titre requis')
      parsed.id = id // conserver l'id original
      saveFiche(parsed)
      setSaved(true)
      setTimeout(() => navigate(`/fiche/${id}`), 800)
    } catch (e) {
      setParseError(`Erreur : ${e.message}`)
    }
  }

  const isValid = !parseError && json.trim().length > 0
  const isBuiltIn = !isCustom(id)

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/gestion" style={{ color: '#555', fontSize: '13px', textDecoration: 'none' }} className="hover:text-gray-300">
              ← Gestion
            </Link>
          </div>
          <h1 style={{ fontFamily: 'Oswald, sans-serif', color: '#CC0000', fontSize: '24px', letterSpacing: '2px', margin: 0 }}>
            ✏️ MODIFIER LA FICHE
          </h1>
          <div style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
            {fiche.titre}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/fiche/${id}`}
            style={{ backgroundColor: '#1e2a4a', color: '#9ca3af', fontSize: '14px', textDecoration: 'none', minHeight: '40px', display: 'flex', alignItems: 'center' }}
            className="px-4 rounded border border-gray-700 hover:border-gray-500 transition-colors"
          >
            Voir
          </Link>
          <button
            onClick={handleSave}
            disabled={!isValid || isBuiltIn}
            style={{
              backgroundColor: saved ? '#2ECC71' : (isValid && !isBuiltIn ? '#CC0000' : '#333'),
              color: 'white',
              fontSize: '14px',
              minHeight: '40px'
            }}
            className="px-5 rounded font-bold transition-colors disabled:cursor-not-allowed"
          >
            {saved ? '✓ Sauvegardé' : '💾 Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Avertissement fiche officielle */}
      {isBuiltIn && (
        <div style={{ backgroundColor: '#1a0a00', border: '1px solid #FF6B35', color: '#FF6B35', fontSize: '14px' }} className="rounded p-3 mb-4 flex items-start gap-2">
          <span>⚠️</span>
          <div>
            Fiche officielle — non modifiable directement.{' '}
            <button
              onClick={() => {
                const fork = { ...fiche, id: `fork-${fiche.id}-${Date.now()}`, source: 'utilisateur', titre: `${fiche.titre} (copie)` }
                saveFiche(fork)
                navigate(`/modifier-fiche/${fork.id}`)
              }}
              style={{ color: '#F39C12', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
            >
              Créer une copie modifiable
            </button>
          </div>
        </div>
      )}

      {/* Aide rapide */}
      <div style={{ backgroundColor: '#0d0d1e', border: '1px solid #1e1e3a', fontSize: '13px', color: '#666' }} className="rounded p-3 mb-4">
        Éditez le JSON directement. Les champs <code style={{ color: '#a5b4fc', backgroundColor: '#1e1e3a', padding: '1px 4px', borderRadius: '3px' }}>siSecoursTardent</code>, <code style={{ color: '#a5b4fc', backgroundColor: '#1e1e3a', padding: '1px 4px', borderRadius: '3px' }}>arbresDecision</code>, <code style={{ color: '#a5b4fc', backgroundColor: '#1e1e3a', padding: '1px 4px', borderRadius: '3px' }}>notesCritiques</code>, etc. sont tous éditables. Le JSON doit être valide pour pouvoir sauvegarder.
      </div>

      {/* Erreur de parsing */}
      {parseError && (
        <div style={{ backgroundColor: '#2a0000', border: '1px solid #CC0000', color: '#ff8080', fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace' }} className="rounded p-3 mb-3">
          ✗ JSON invalide : {parseError}
        </div>
      )}
      {!parseError && json.trim() && (
        <div style={{ color: '#2ECC71', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace' }} className="mb-3">
          ✓ JSON valide
        </div>
      )}

      {/* Éditeur JSON */}
      <textarea
        value={json}
        onChange={e => handleChange(e.target.value)}
        disabled={isBuiltIn}
        style={{
          backgroundColor: '#0a0a14',
          borderColor: parseError ? '#CC0000' : '#1e1e3a',
          color: '#d4d4d4',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '13px',
          lineHeight: 1.6,
          resize: 'vertical',
          minHeight: '600px',
          width: '100%',
          border: `1px solid ${parseError ? '#CC0000' : '#1e1e3a'}`,
          borderRadius: '8px',
          padding: '16px',
          outline: 'none',
          opacity: isBuiltIn ? 0.5 : 1
        }}
        spellCheck={false}
      />

      <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
        <div style={{ color: '#555', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace' }}>
          {json.split('\n').length} lignes — {json.length} caractères
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setJson(JSON.stringify(JSON.parse(json), null, 2))}
            disabled={!!parseError || !json.trim()}
            style={{ backgroundColor: '#1e1e3e', color: '#9ca3af', fontSize: '13px', border: '1px solid #333', minHeight: '36px' }}
            className="px-3 rounded hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Formater
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || isBuiltIn}
            style={{ backgroundColor: saved ? '#2ECC71' : '#CC0000', color: 'white', fontSize: '14px', minHeight: '36px' }}
            className="px-5 rounded font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saved ? '✓ Sauvegardé' : '💾 Sauvegarder'}
          </button>
        </div>
      </div>
    </main>
  )
}
