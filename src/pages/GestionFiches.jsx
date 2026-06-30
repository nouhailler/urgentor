import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFiches } from '../hooks/useFiches'
import { TOUTES_FICHES } from '../data/ficheIndex'
import { getCategorieById, getSeverity } from '../data/categories'
import { loadAllNotes } from '../hooks/useNotes'

const SOURCE_CONFIG = {
  officielle:   { label: 'Officielle', neutral: true, icon: '🔒' },
  'ia-generee': { label: 'IA',     icon: '✦' },
  utilisateur:  { label: 'Perso',  icon: '✎' }
}

function SourceBadge({ source }) {
  const cfg = SOURCE_CONFIG[source] ?? SOURCE_CONFIG.utilisateur
  const neutral = cfg.neutral
  return (
    <span
      style={{
        backgroundColor: neutral ? 'var(--chip-bg)' : 'var(--accent-soft)',
        color: neutral ? 'var(--chip-text)' : 'var(--accent-deep)',
        fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.3px',
      }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
    >
      {cfg.icon} {cfg.label}
    </span>
  )
}

function FicheRow({ fiche, isCustom, onDelete, onExport }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const categorie = getCategorieById(fiche.categorie)
  const sev = getSeverity(fiche.niveauDanger)
  const notes = loadAllNotes()
  const hasNote = !!notes[fiche.id]?.trim()

  return (
    <div className="px-4 py-3.5 flex items-center gap-3 flex-wrap" style={{ borderBottom: '1px solid var(--divider)' }}>
      <span style={{ fontSize: '18px', color: categorie?.couleur }} className="flex-shrink-0">{categorie?.icone ?? '📄'}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={`/fiche/${fiche.id}`}
            style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}
            className="hover:text-[var(--accent-deep)] transition-colors truncate"
          >
            {fiche.titre}
          </Link>
          <span style={{ backgroundColor: sev.bg, color: sev.color, border: `1px solid ${sev.color}33`, fontFamily: 'var(--font-mono)', fontSize: '9.5px', padding: '2px 6px' }} className="rounded-full uppercase">
            {sev.label}
          </span>
          <SourceBadge source={fiche.source} />
          {hasNote && <span style={{ color: 'var(--warning)', fontSize: '11px' }} title="Contient des notes">📝</span>}
        </div>
        <div style={{ color: 'var(--text-faint)', fontSize: '12px', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
          {fiche.id}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Link to={`/fiche/${fiche.id}`} className="icon-btn px-2 py-1.5 rounded-lg flex items-center" title="Voir" style={{ textDecoration: 'none', minHeight: '36px' }}>
          👁
        </Link>
        <button onClick={() => onExport(fiche)} className="icon-btn px-2 py-1.5 rounded-lg" title="Exporter" style={{ minHeight: '36px' }}>⬇️</button>
        {isCustom ? (
          <Link to={`/modifier-fiche/${fiche.id}`} className="icon-btn px-2 py-1.5 rounded-lg flex items-center" title="Modifier" style={{ textDecoration: 'none', minHeight: '36px' }}>✏️</Link>
        ) : (
          <button onClick={() => onExport(fiche)} className="icon-btn px-2 py-1.5 rounded-lg" title="Dupliquer" style={{ minHeight: '36px' }}>⧉</button>
        )}
        {isCustom && (
          confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={() => onDelete(fiche.id)} style={{ backgroundColor: 'var(--danger)', color: 'white', fontSize: '12px', border: 'none', cursor: 'pointer', minHeight: '32px' }} className="px-2 py-1 rounded-lg">Confirmer</button>
              <button onClick={() => setConfirmDelete(false)} className="icon-btn px-2 py-1 rounded-lg" style={{ fontSize: '12px', minHeight: '32px' }}>Annuler</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="icon-btn danger px-2 py-1.5 rounded-lg" title="Supprimer" style={{ minHeight: '36px' }}>🗑</button>
          )
        )}
      </div>
    </div>
  )
}

export default function GestionFiches() {
  const { allFiches, deleteFiche, exportFiches, importFiches, isCustom } = useFiches()
  const [tab, setTab] = useState('toutes')
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState('')
  const fileRef = useRef()

  const customCount = allFiches.filter(f => isCustom(f.id)).length
  const officialCount = TOUTES_FICHES.length

  const fiches = tab === 'custom'
    ? allFiches.filter(f => isCustom(f.id))
    : tab === 'officielles'
      ? TOUTES_FICHES
      : allFiches

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const added = importFiches(ev.target.result)
        setImportSuccess(`${added} fiche${added > 1 ? 's' : ''} importée${added > 1 ? 's' : ''}`)
        setImportError('')
        setTimeout(() => setImportSuccess(''), 3000)
      } catch (err) {
        setImportError(`Erreur d'import : ${err.message}`)
        setImportSuccess('')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleExportSingle = (fiche) => exportFiches([fiche])

  const tabBtn = (active) => ({
    flex: 1, minHeight: '36px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 600,
    fontFamily: 'var(--font-body)', cursor: 'pointer', border: 'none',
    background: active ? 'var(--surface)' : 'transparent',
    color: active ? 'var(--text)' : 'var(--text-secondary)',
    boxShadow: active ? 'var(--shadow-seg-active)' : 'none',
    transition: 'all .15s ease',
  })

  return (
    <main className="max-w-5xl mx-auto px-4 py-7 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }} className="uppercase">
            Gestion
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '30px', fontWeight: 700, letterSpacing: '-0.3px', margin: 0 }}>
            Gestion des fiches
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            {officialCount} officielle{officialCount > 1 ? 's' : ''} · {customCount} personnelle{customCount > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="btn-outline flex items-center gap-2 px-4 py-2 rounded-[10px]" style={{ fontSize: '14px', minHeight: '40px' }}>
            ⬆️ Importer JSON
          </button>
          <button onClick={() => exportFiches(allFiches)} className="btn-outline flex items-center gap-2 px-4 py-2 rounded-[10px]" style={{ fontSize: '14px', minHeight: '40px' }}>
            ⬇️ Tout exporter
          </button>
        </div>
      </div>

      {/* Messages import */}
      {importSuccess && (
        <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success)', fontSize: '14px' }} className="rounded-lg p-3 mb-4">
          ✓ {importSuccess}
        </div>
      )}
      {importError && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: '14px' }} className="rounded-lg p-3 mb-4">
          {importError}
        </div>
      )}

      {/* Onglets */}
      <div style={{ background: '#EBEEF2', borderRadius: '10px', padding: '4px' }} className="flex gap-1 mb-5">
        {[
          { id: 'toutes', label: `Toutes (${allFiches.length})` },
          { id: 'custom', label: `Personnelles (${customCount})` },
          { id: 'officielles', label: `Officielles (${officialCount})` }
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={tabBtn(tab === t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Liste */}
      {fiches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📭</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Aucune fiche {tab === 'custom' ? 'personnelle' : ''}</div>
          {tab === 'custom' && (
            <Link to="/nouvelle-fiche" style={{ color: 'var(--accent)', marginTop: '12px', display: 'inline-block' }}>+ Créer une fiche</Link>
          )}
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
          {fiches.map(fiche => (
            <FicheRow
              key={fiche.id}
              fiche={fiche}
              isCustom={isCustom(fiche.id)}
              onDelete={deleteFiche}
              onExport={handleExportSingle}
            />
          ))}
        </div>
      )}
    </main>
  )
}
