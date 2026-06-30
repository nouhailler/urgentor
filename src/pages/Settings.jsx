import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSettings, PROVIDERS } from '../hooks/useSettings'
import { useOpenRouterModels, formatLastFetch } from '../hooks/useOpenRouterModels'
import { useFiches } from '../hooks/useFiches'

/* ── Icônes fournisseurs ─────────────────────────────────────────── */
const PROVIDER_ICONS = {
  anthropic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-3.654 0H6.57L0 20h3.603l1.327-3.324h6.397l1.327 3.324h3.603L10.173 3.52zm-3.176 10.36l2.113-5.302 2.113 5.302H6.997z"/>
    </svg>
  ),
  openai: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  ),
  openrouter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98z"/>
    </svg>
  )
}

const fieldLabel = { color: 'var(--text-secondary)', fontSize: '12px', letterSpacing: '0.5px' }
const inputBase = {
  backgroundColor: 'var(--surface-input)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-control)',
  color: 'var(--text)',
}

/* ── Champ clé API réutilisable ──────────────────────────────────── */
function KeyField({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputBase, fontSize: '14px', fontFamily: 'var(--font-mono)', paddingRight: '44px' }}
        className="w-full px-4 py-3 outline-none"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        style={{ color: 'var(--text-muted)' }}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-[var(--text)] transition-colors"
      >
        {show ? (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  )
}

/* ── Section Anthropic / OpenAI (modèles fixes) ─────────────────── */
function StaticProviderSection({ providerId, config, settings, onUpdate }) {
  const currentKey = settings[providerId]?.key ?? ''
  const currentModel = settings[providerId]?.model ?? config.models[0]?.id ?? ''
  const isConfigured = !!currentKey.trim()

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)' }} className="p-5">
      <ProviderHeader providerId={providerId} config={config} isConfigured={isConfigured} />
      <div className="flex flex-col gap-3 mt-4">
        <div>
          <label style={fieldLabel} className="block mb-1.5 uppercase tracking-wider font-medium">Clé API</label>
          <KeyField value={currentKey} onChange={v => onUpdate(providerId, { key: v })} placeholder={config.placeholder} />
        </div>
        <div>
          <label style={fieldLabel} className="block mb-1.5 uppercase tracking-wider font-medium">Modèle par défaut</label>
          <select value={currentModel} onChange={e => onUpdate(providerId, { model: e.target.value })} style={{ ...inputBase, fontSize: '14px' }} className="w-full px-4 py-3 outline-none">
            {config.models.map(m => (<option key={m.id} value={m.id}>{m.label}</option>))}
          </select>
        </div>
        {isConfigured && (
          <button onClick={() => onUpdate(providerId, { key: '' })} style={{ color: 'var(--text-muted)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }} className="hover:text-[var(--danger)] transition-colors">
            ✕ Effacer la clé
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Section OpenRouter (modèles dynamiques) ─────────────────────── */
function OpenRouterSection({ settings, onUpdate }) {
  const config = PROVIDERS.openrouter
  const currentKey = settings.openrouter?.key ?? ''
  const currentModel = settings.openrouter?.model ?? ''
  const isConfigured = !!currentKey.trim()

  const { models, lastFetch, loading, error, refresh } = useOpenRouterModels(currentKey)
  const [filter, setFilter] = useState('')

  const filtered = models.filter(m =>
    filter === '' ||
    m.name.toLowerCase().includes(filter.toLowerCase()) ||
    m.id.toLowerCase().includes(filter.toLowerCase())
  )

  const handleSelect = (modelId) => onUpdate('openrouter', { model: modelId })

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)' }} className="p-5">
      <ProviderHeader providerId="openrouter" config={config} isConfigured={isConfigured} />
      <div className="flex flex-col gap-3 mt-4">
        <div>
          <label style={fieldLabel} className="block mb-1.5 uppercase tracking-wider font-medium">Clé API</label>
          <KeyField value={currentKey} onChange={v => onUpdate('openrouter', { key: v })} placeholder={config.placeholder} />
        </div>

        <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card-sm)' }} className="p-4">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <div>
              <div style={{ color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                Modèles gratuits <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>:free</span>
              </div>
              <div style={{ color: 'var(--text-faint)', fontSize: '11px', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {models.length > 0
                  ? `${models.length} modèle${models.length > 1 ? 's' : ''} — MAJ ${formatLastFetch(lastFetch)}`
                  : lastFetch ? 'Aucun modèle trouvé' : 'Non chargés'}
              </div>
            </div>
            <button onClick={refresh} disabled={loading} className="btn-outline flex items-center gap-2 px-3 py-1.5 rounded-[10px]" style={{ fontSize: '13px', minHeight: '36px', minWidth: '110px', opacity: loading ? 0.6 : 1 }}>
              <svg className={loading ? 'animate-spin' : ''} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Chargement…' : 'Actualiser'}
            </button>
          </div>

          {error && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: '13px' }} className="rounded-lg p-2 mb-3">{error}</div>
          )}

          {models.length > 0 && (
            <div className="relative mb-2">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder={`Filtrer parmi ${models.length} modèles…`} style={{ ...inputBase, fontSize: '13px', paddingLeft: '32px' }} className="w-full py-2 pr-3 outline-none" />
              {filter && <button onClick={() => setFilter('')} style={{ color: 'var(--text-muted)' }} className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-[var(--text)] text-xs">✕</button>}
            </div>
          )}

          {models.length === 0 && !loading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
              {lastFetch ? 'Aucun modèle :free disponible' : <span>Cliquez sur <strong style={{ color: 'var(--accent)' }}>Actualiser</strong> pour charger la liste</span>}
            </div>
          ) : (
            <div style={{ maxHeight: '280px', overflowY: 'auto', scrollbarWidth: 'thin' }} className="flex flex-col gap-1">
              {filtered.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>Aucun résultat pour « {filter} »</div>
              ) : (
                filtered.map(m => {
                  const selected = currentModel === m.id
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleSelect(m.id)}
                      style={{
                        backgroundColor: selected ? 'var(--accent-soft)' : 'transparent',
                        border: `1px solid ${selected ? 'var(--accent)' : 'transparent'}`,
                        textAlign: 'left', borderRadius: 'var(--radius-inner)',
                      }}
                      className="w-full px-3 py-2 hover:bg-[var(--chip-bg)] transition-colors group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div style={{ color: selected ? 'var(--accent-deep)' : 'var(--text)', fontSize: '13px', fontWeight: selected ? 600 : 400 }} className="truncate">{m.name}</div>
                          <div style={{ color: 'var(--text-faint)', fontSize: '11px', fontFamily: 'var(--font-mono)' }} className="truncate">{m.id}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {m.contextLength && (
                            <span style={{ color: 'var(--text-faint)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                              {m.contextLength >= 1000 ? `${Math.round(m.contextLength / 1000)}k` : m.contextLength}
                            </span>
                          )}
                          {selected ? <span style={{ color: 'var(--accent)' }}>✓</span> : <span style={{ color: 'var(--text-faint)' }}>○</span>}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          )}

          {currentModel && (
            <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)', marginTop: '10px', borderRadius: 'var(--radius-inner)' }} className="px-3 py-2">
              <div style={{ color: 'var(--accent-deep)', fontSize: '10.5px', marginBottom: '2px', fontFamily: 'var(--font-mono)' }} className="uppercase tracking-wide">Modèle sélectionné</div>
              <div style={{ color: 'var(--accent-deep)', fontSize: '12px', fontFamily: 'var(--font-mono)' }} className="truncate">{currentModel}</div>
            </div>
          )}
        </div>

        {isConfigured && (
          <button onClick={() => onUpdate('openrouter', { key: '' })} style={{ color: 'var(--text-muted)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }} className="hover:text-[var(--danger)] transition-colors">
            ✕ Effacer la clé
          </button>
        )}
      </div>
    </div>
  )
}

/* ── En-tête commune aux sections ───────────────────────────────── */
function ProviderHeader({ providerId, config, isConfigured }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: isConfigured ? 'var(--success)' : 'var(--warning)', flexShrink: 0 }} />
        <div style={{ color: 'var(--text)' }}>{PROVIDER_ICONS[providerId]}</div>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '17px', fontWeight: 700 }}>
          {config.label}
        </div>
      </div>
      <span
        style={{
          backgroundColor: isConfigured ? 'var(--success-bg)' : 'var(--warning-bg)',
          color: isConfigured ? 'var(--success)' : 'var(--warning)',
          fontSize: '11px', fontFamily: 'var(--font-mono)',
        }}
        className="px-2.5 py-1 rounded-full"
      >
        {isConfigured ? 'Configurée' : 'Non configurée'}
      </span>
    </div>
  )
}

/* ── Import de fiches ────────────────────────────────────────────── */
function ImportFichesSection() {
  const { importFiches, allFiches, isCustom } = useFiches()
  const fileRef = useRef()
  const [status, setStatus] = useState(null)
  const [dragging, setDragging] = useState(false)

  const processFile = (file) => {
    if (!file || !file.name.endsWith('.json')) {
      setStatus({ ok: false, message: 'Le fichier doit être au format .json' })
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const added = importFiches(ev.target.result)
        if (added === 0) setStatus({ ok: false, message: 'Aucune nouvelle fiche — toutes déjà présentes (doublon d\'id).' })
        else setStatus({ ok: true, count: added, message: `${added} fiche${added > 1 ? 's' : ''} importée${added > 1 ? 's' : ''} avec succès` })
      } catch (err) {
        setStatus({ ok: false, message: `Fichier invalide : ${err.message}` })
      }
    }
    reader.readAsText(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleFile = (e) => processFile(e.target.files?.[0])
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files?.[0]) }
  const customCount = allFiches.filter(f => isCustom(f.id)).length

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)' }} className="p-5">
      <div className="flex items-center justify-between mb-1">
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '17px', fontWeight: 700 }}>
          Import de fiches
        </div>
        {customCount > 0 && (
          <Link to="/gestion" style={{ color: 'var(--accent)', fontSize: '12px', textDecoration: 'none' }} className="hover:underline">
            {customCount} fiche{customCount > 1 ? 's' : ''} →
          </Link>
        )}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
        Importez un fichier JSON exporté depuis un autre appareil ou préparé sur desktop.
      </p>

      <input ref={fileRef} type="file" accept=".json,application/json" onChange={handleFile} className="hidden" />
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border-strong)'}`,
          backgroundColor: dragging ? 'var(--accent-soft)' : 'var(--surface-subtle)',
          borderRadius: 'var(--radius-card-sm)', padding: '28px 16px', cursor: 'pointer',
          transition: 'all 0.2s', textAlign: 'center',
        }}
      >
        <div style={{ color: dragging ? 'var(--accent)' : 'var(--text-muted)', marginBottom: '10px' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
          {dragging ? 'Déposez ici' : 'Glisser-déposer un fichier JSON'}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
          Touchez pour parcourir · ou glissez-déposez un fichier .json
        </div>
      </div>

      {status && (
        <div
          style={{
            background: status.ok ? 'var(--success-bg)' : 'var(--danger-bg)',
            border: `1px solid ${status.ok ? 'var(--success)' : 'var(--danger)'}`,
            color: status.ok ? 'var(--success)' : 'var(--danger)',
            fontSize: '14px', marginTop: '12px',
          }}
          className="rounded-lg p-3 flex items-start gap-2"
        >
          <span>{status.ok ? '✓' : '✗'}</span>
          <div className="flex-1">
            {status.message}
            {status.ok && (
              <Link to="/gestion" style={{ color: 'var(--success)', display: 'block', fontSize: '12px', marginTop: '4px' }}>→ Voir dans Gestion des fiches</Link>
            )}
          </div>
          <button onClick={() => setStatus(null)} style={{ color: 'inherit', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7, padding: '0 2px' }}>✕</button>
        </div>
      )}

      <div style={{ color: 'var(--text-faint)', fontSize: '12px', marginTop: '12px', lineHeight: 1.6 }}>
        Format accepté : tableau JSON <code style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>[{'{...}'}]</code> ou fiche unique <code style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{'{...}'}</code>.
        Chaque fiche doit avoir les champs <code style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>id</code> et <code style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>titre</code>.
      </div>
    </div>
  )
}

/* ── Page principale ─────────────────────────────────────────────── */
export default function Settings() {
  const { settings, updateProvider } = useSettings()
  const [flash, setFlash] = useState('')

  const handleUpdate = (provider, patch) => {
    updateProvider(provider, patch)
    setFlash('Sauvegardé')
    setTimeout(() => setFlash(''), 1500)
  }

  return (
    <main className="mx-auto px-4 py-7 w-full" style={{ maxWidth: '760px' }}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }} className="uppercase">
            Paramètres
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '30px', fontWeight: 700, letterSpacing: '-0.3px', margin: 0 }}>
            Paramètres
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            Clés API et import de fiches.
          </p>
        </div>
        {flash && (
          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success)', fontSize: '13px' }} className="px-3 py-1.5 rounded-lg flex-shrink-0">✓ {flash}</div>
        )}
      </div>

      {/* Clés API */}
      <div className="mb-2 flex items-center justify-between">
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '16px', fontWeight: 700 }}>Clés API</h2>
        <span style={{ color: 'var(--text-faint)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>Stockées uniquement sur cet appareil</span>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <StaticProviderSection providerId="anthropic" config={PROVIDERS.anthropic} settings={settings} onUpdate={handleUpdate} />
        <StaticProviderSection providerId="openai" config={PROVIDERS.openai} settings={settings} onUpdate={handleUpdate} />
        <OpenRouterSection settings={settings} onUpdate={handleUpdate} />
      </div>

      <ImportFichesSection />

      {/* Notice sécurité */}
      <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginTop: '24px' }} className="rounded-lg p-4">
        <div style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '6px' }}>🔒 Sécurité</div>
        Les clés API sont stockées uniquement dans le <strong style={{ color: 'var(--text)' }}>localStorage</strong> de votre navigateur. Elles ne transitent jamais par un serveur tiers — chaque appel est direct vers l'API du fournisseur.
      </div>
    </main>
  )
}
