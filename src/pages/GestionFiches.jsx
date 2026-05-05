import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFiches } from '../hooks/useFiches'
import { TOUTES_FICHES } from '../data/ficheIndex'
import { getCategorieById } from '../data/categories'
import { loadAllNotes } from '../hooks/useNotes'

const SOURCE_CONFIG = {
  officielle:   { label: 'Officielle', color: '#2ECC71', icon: '🏛️' },
  'ia-generee': { label: 'IA',         color: '#6366F1', icon: '🤖' },
  utilisateur:  { label: 'Manuel',     color: '#F39C12', icon: '✏️' }
}

function SourceBadge({ source }) {
  const cfg = SOURCE_CONFIG[source] ?? SOURCE_CONFIG.utilisateur
  return (
    <span
      style={{ backgroundColor: cfg.color + '22', color: cfg.color, borderColor: cfg.color + '44', fontSize: '11px' }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
    >
      {cfg.icon} {cfg.label}
    </span>
  )
}

function FicheRow({ fiche, isCustom, onDelete, onExport }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const categorie = getCategorieById(fiche.categorie)
  const notes = loadAllNotes()
  const hasNote = !!notes[fiche.id]?.trim()

  return (
    <div
      style={{
        backgroundColor: '#16213e',
        borderLeft: `3px solid ${categorie?.couleur ?? '#444'}`
      }}
      className="rounded-lg px-4 py-3 flex items-center gap-3 flex-wrap"
    >
      {/* Icône catégorie */}
      <span className="text-xl flex-shrink-0">{categorie?.icone ?? '📄'}</span>

      {/* Titre + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={`/fiche/${fiche.id}`}
            style={{ color: '#f0f0f0', fontFamily: 'Oswald, sans-serif', fontSize: '15px', textDecoration: 'none' }}
            className="hover:text-red-400 transition-colors truncate"
          >
            {fiche.titre}
          </Link>
          <SourceBadge source={fiche.source} />
          {hasNote && (
            <span style={{ color: '#F39C12', fontSize: '11px' }} title="Contient des notes">📝</span>
          )}
        </div>
        <div style={{ color: '#555', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', marginTop: '2px' }}>
          {fiche.id}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          to={`/fiche/${fiche.id}`}
          style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}
          className="px-2 py-1 rounded hover:bg-gray-700 transition-colors"
          title="Voir"
        >
          👁
        </Link>

        {isCustom && (
          <Link
            to={`/modifier-fiche/${fiche.id}`}
            style={{ color: '#6366F1', fontSize: '13px', textDecoration: 'none' }}
            className="px-2 py-1 rounded hover:bg-indigo-900 transition-colors"
            title="Modifier"
          >
            ✏️
          </Link>
        )}

        <button
          onClick={() => onExport(fiche)}
          style={{ color: '#9ca3af', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}
          className="px-2 py-1 rounded hover:bg-gray-700 transition-colors"
          title="Exporter cette fiche"
        >
          ⬇️
        </button>

        {isCustom && (
          confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(fiche.id)}
                style={{ backgroundColor: '#CC0000', color: 'white', fontSize: '12px', border: 'none', cursor: 'pointer' }}
                className="px-2 py-1 rounded"
              >
                Confirmer
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{ color: '#9ca3af', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
                className="px-2 py-1 rounded hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{ color: '#666', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}
              className="px-2 py-1 rounded hover:text-red-400 hover:bg-red-900/20 transition-colors"
              title="Supprimer"
            >
              🗑
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default function GestionFiches() {
  const { allFiches, deleteFiche, exportFiches, importFiches, isCustom } = useFiches()
  const [tab, setTab] = useState('toutes') // 'toutes' | 'custom' | 'officielles'
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState('')
  const fileRef = useRef()

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

  const handleExportAll = () => {
    exportFiches(allFiches.filter(f => isCustom(f.id)))
  }

  const handleExportSingle = (fiche) => {
    exportFiches([fiche])
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 style={{ fontFamily: 'Oswald, sans-serif', color: '#CC0000', fontSize: '28px', letterSpacing: '2px', marginBottom: '4px' }}>
            📂 GESTION DES FICHES
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            {allFiches.length} fiche{allFiches.length > 1 ? 's' : ''} au total — {allFiches.filter(f => isCustom(f.id)).length} personnalisée{allFiches.filter(f => isCustom(f.id)).length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Import / Export */}
        <div className="flex gap-2 flex-wrap">
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            style={{ backgroundColor: '#1e2a4a', borderColor: '#6366F1', color: '#a5b4fc', fontSize: '14px', minHeight: '40px' }}
            className="flex items-center gap-2 px-4 py-2 rounded border hover:bg-indigo-900/40 transition-colors"
          >
            ⬆️ Importer
          </button>
          <button
            onClick={handleExportAll}
            disabled={allFiches.filter(f => isCustom(f.id)).length === 0}
            style={{ backgroundColor: '#1e2a4a', borderColor: '#2ECC71', color: '#86efac', fontSize: '14px', minHeight: '40px' }}
            className="flex items-center gap-2 px-4 py-2 rounded border hover:bg-green-900/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⬇️ Exporter perso.
          </button>
          <button
            onClick={() => exportFiches(allFiches)}
            style={{ backgroundColor: '#1e2a4a', borderColor: '#F39C12', color: '#fcd34d', fontSize: '14px', minHeight: '40px' }}
            className="flex items-center gap-2 px-4 py-2 rounded border hover:bg-yellow-900/20 transition-colors"
          >
            ⬇️ Exporter tout
          </button>
        </div>
      </div>

      {/* Messages import */}
      {importSuccess && (
        <div style={{ backgroundColor: '#0a2a0a', border: '1px solid #2ECC71', color: '#2ECC71', fontSize: '14px' }} className="rounded p-3 mb-4">
          ✓ {importSuccess}
        </div>
      )}
      {importError && (
        <div style={{ backgroundColor: '#2a0000', border: '1px solid #CC0000', color: '#ff8080', fontSize: '14px' }} className="rounded p-3 mb-4">
          {importError}
        </div>
      )}

      {/* Onglets */}
      <div style={{ backgroundColor: '#0d0d1e', border: '1px solid #1e1e3a' }} className="rounded-lg p-1 flex gap-1 mb-5">
        {[
          { id: 'toutes', label: `Toutes (${allFiches.length})` },
          { id: 'custom', label: `Personnalisées (${allFiches.filter(f => isCustom(f.id)).length})` },
          { id: 'officielles', label: `Officielles (${TOUTES_FICHES.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              backgroundColor: tab === t.id ? '#CC0000' : 'transparent',
              color: tab === t.id ? 'white' : '#9ca3af',
              fontSize: '14px',
              minHeight: '36px',
              flex: 1
            }}
            className="rounded font-medium transition-colors"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {fiches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📭</div>
          <div style={{ color: '#9ca3af', fontSize: '16px' }}>Aucune fiche {tab === 'custom' ? 'personnalisée' : ''}</div>
          {tab === 'custom' && (
            <Link to="/nouvelle-fiche" style={{ color: '#CC0000', marginTop: '12px', display: 'inline-block' }}>
              + Créer une fiche
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
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
