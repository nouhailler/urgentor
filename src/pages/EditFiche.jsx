import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useFiches } from '../hooks/useFiches'
import { TOUTES_FICHES } from '../data/ficheIndex'

export default function EditFiche() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { saveFiche, isCustom } = useFiches()

  const stored = localStorage.getItem('urgentor_fiches_custom')
  const customFiches = stored ? JSON.parse(stored) : []
  const allFiches = [...TOUTES_FICHES, ...customFiches]
  const fiche = allFiches.find(f => f.id === id)

  const [json, setJson] = useState('')
  const [parseError, setParseError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (fiche) setJson(JSON.stringify(fiche, null, 2))
  }, [id])

  if (!fiche) {
    return (
      <main className="mx-auto px-4 py-10 text-center" style={{ maxWidth: '760px' }}>
        <div style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>Fiche introuvable</div>
        <Link to="/gestion" style={{ color: 'var(--accent)', display: 'block', marginTop: '12px' }}>← Gestion des fiches</Link>
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
      parsed.id = id
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
    <main className="max-w-4xl mx-auto px-4 py-7 w-full">
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <Link to="/gestion" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none' }} className="hover:text-[var(--text)]">← Gestion</Link>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.2px', margin: '4px 0 0' }}>
            Modifier la fiche
          </h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{fiche.titre}</div>
        </div>

        <div className="flex gap-2">
          <Link to={`/fiche/${id}`} className="btn-outline px-4 flex items-center" style={{ fontSize: '14px', textDecoration: 'none', minHeight: '40px', borderRadius: 'var(--radius-control)' }}>Voir</Link>
          <button
            onClick={handleSave}
            disabled={!isValid || isBuiltIn}
            style={{
              backgroundColor: saved ? 'var(--success)' : (isValid && !isBuiltIn ? 'var(--ink)' : 'var(--border-strong)'),
              color: 'white', fontSize: '14px', minHeight: '40px', borderRadius: 'var(--radius-control)',
            }}
            className="px-5 font-semibold transition-colors disabled:cursor-not-allowed"
          >
            {saved ? '✓ Sauvegardé' : '💾 Sauvegarder'}
          </button>
        </div>
      </div>

      {isBuiltIn && (
        <div style={{ background: 'var(--panel-warn-bg)', border: '1px solid var(--panel-warn-border)', color: 'var(--warning)', fontSize: '14px' }} className="rounded-lg p-3 mb-4 flex items-start gap-2">
          <span>⚠️</span>
          <div>
            Fiche officielle — non modifiable directement.{' '}
            <button
              onClick={() => {
                const fork = { ...fiche, id: `fork-${fiche.id}-${Date.now()}`, source: 'utilisateur', titre: `${fiche.titre} (copie)` }
                saveFiche(fork)
                navigate(`/modifier-fiche/${fork.id}`)
              }}
              style={{ color: 'var(--accent-deep)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontWeight: 600 }}
            >
              Créer une copie modifiable
            </button>
          </div>
        </div>
      )}

      <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-secondary)' }} className="rounded-lg p-3 mb-4">
        Éditez le JSON directement. Les champs <code style={{ color: 'var(--accent-deep)', backgroundColor: 'var(--accent-soft)', padding: '1px 4px', borderRadius: '3px', fontFamily: 'var(--font-mono)' }}>siSecoursTardent</code>, <code style={{ color: 'var(--accent-deep)', backgroundColor: 'var(--accent-soft)', padding: '1px 4px', borderRadius: '3px', fontFamily: 'var(--font-mono)' }}>arbresDecision</code>, <code style={{ color: 'var(--accent-deep)', backgroundColor: 'var(--accent-soft)', padding: '1px 4px', borderRadius: '3px', fontFamily: 'var(--font-mono)' }}>notesCritiques</code>, etc. sont tous éditables. Le JSON doit être valide pour pouvoir sauvegarder.
      </div>

      {parseError && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: '13px', fontFamily: 'var(--font-mono)' }} className="rounded-lg p-3 mb-3">
          ✗ JSON invalide : {parseError}
        </div>
      )}
      {!parseError && json.trim() && (
        <div style={{ color: 'var(--success)', fontSize: '12px', fontFamily: 'var(--font-mono)' }} className="mb-3">✓ JSON valide</div>
      )}

      <textarea
        value={json}
        onChange={e => handleChange(e.target.value)}
        disabled={isBuiltIn}
        style={{
          backgroundColor: 'var(--surface-input)',
          color: 'var(--text)',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          lineHeight: 1.6,
          resize: 'vertical',
          minHeight: '600px',
          width: '100%',
          border: `1px solid ${parseError ? 'var(--danger)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius-control)',
          padding: '16px',
          outline: 'none',
          opacity: isBuiltIn ? 0.55 : 1
        }}
        spellCheck={false}
      />

      <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
        <div style={{ color: 'var(--text-faint)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
          {json.split('\n').length} lignes — {json.length} caractères
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setJson(JSON.stringify(JSON.parse(json), null, 2))}
            disabled={!!parseError || !json.trim()}
            className="btn-outline px-3"
            style={{ fontSize: '13px', minHeight: '36px', borderRadius: 'var(--radius-control)', opacity: (!!parseError || !json.trim()) ? 0.4 : 1 }}
          >
            Formater
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || isBuiltIn}
            style={{ backgroundColor: saved ? 'var(--success)' : 'var(--ink)', color: 'white', fontSize: '14px', minHeight: '36px', borderRadius: 'var(--radius-control)', opacity: (!isValid || isBuiltIn) ? 0.4 : 1 }}
            className="px-5 font-semibold transition-colors disabled:cursor-not-allowed"
          >
            {saved ? '✓ Sauvegardé' : '💾 Sauvegarder'}
          </button>
        </div>
      </div>
    </main>
  )
}
