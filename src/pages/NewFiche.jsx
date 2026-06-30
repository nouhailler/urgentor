import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AIGenerator from '../components/AIGenerator'
import { useFiches } from '../hooks/useFiches'
import { CATEGORIES } from '../data/categories'

export default function NewFiche() {
  const navigate = useNavigate()
  const { saveFiche } = useFiches()
  const [mode, setMode] = useState('ai') // 'ai' | 'manual'

  const handleFicheGenerated = (fiche) => {
    saveFiche(fiche)
    navigate(`/fiche/${fiche.id}`)
  }

  const seg = (active) => ({
    flex: 1,
    minHeight: '40px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    background: active ? 'var(--surface)' : 'transparent',
    color: active ? 'var(--text)' : 'var(--text-secondary)',
    boxShadow: active ? 'var(--shadow-seg-active)' : 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all .15s ease',
  })

  return (
    <main className="mx-auto px-4 py-7 w-full" style={{ maxWidth: '760px' }}>
      <div className="mb-6">
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }} className="uppercase">
          Création
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '30px', fontWeight: 700, letterSpacing: '-0.3px', margin: 0 }}>
          Nouvelle fiche
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>
          Créez une fiche personnalisée avec l'IA ou manuellement.
        </p>
      </div>

      {/* Sélecteur de mode */}
      <div style={{ background: '#EBEEF2', borderRadius: '10px', padding: '4px' }} className="flex gap-1 mb-6">
        <button onClick={() => setMode('ai')} style={seg(mode === 'ai')}>✦ Génération IA</button>
        <button onClick={() => setMode('manual')} style={seg(mode === 'manual')}>Saisie manuelle</button>
      </div>

      {mode === 'ai' ? (
        <AIGenerator onFicheGenerated={handleFicheGenerated} />
      ) : (
        <ManualForm onSave={handleFicheGenerated} />
      )}
    </main>
  )
}

const DANGERS = [
  { id: 'standard', label: 'STANDARD', color: '#1E8A5A' },
  { id: 'élevé', label: 'ÉLEVÉ', color: '#B5740A' },
  { id: 'critique', label: 'CRITIQUE', color: '#C8102E' },
]

function ManualForm({ onSave }) {
  const [data, setData] = useState({
    id: `custom-${Date.now()}`,
    titre: '',
    categorie: 'secours-personne',
    niveauDanger: 'standard',
    objectif: '',
    conditionsActivation: '',
    actionsImmédiates: ['', '', '', ''],
    procedureAction: [{ etape: 1, action: '' }],
    notesCritiques: [''],
    tags: [],
    tagsInput: '',
    source: 'utilisateur',
    dateCreation: new Date().toISOString()
  })

  const set = (key, val) => setData(p => ({ ...p, [key]: val }))

  const addEtape = () => set('procedureAction', [...data.procedureAction, { etape: data.procedureAction.length + 1, action: '' }])
  const updateEtape = (i, val) => set('procedureAction', data.procedureAction.map((e, idx) => idx === i ? { ...e, action: val } : e))

  const handleSave = () => {
    if (!data.titre.trim() || !data.objectif.trim()) {
      alert('Titre et objectif requis')
      return
    }
    const fiche = {
      ...data,
      tags: data.tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      actionsImmédiates: data.actionsImmédiates.filter(Boolean),
      notesCritiques: data.notesCritiques.filter(Boolean)
    }
    delete fiche.tagsInput
    onSave(fiche)
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)' }} className="p-6 flex flex-col gap-5">
      <Field label="Titre *">
        <input type="text" value={data.titre} onChange={e => set('titre', e.target.value)}
          placeholder="Ex : Étouffement adulte" style={inputStyle} className="w-full px-4 py-3 outline-none" />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Catégorie">
          <select value={data.categorie} onChange={e => set('categorie', e.target.value)} style={inputStyle} className="w-full px-4 py-3 outline-none">
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.icone} {c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Niveau de danger">
          <div style={{ background: '#EBEEF2', borderRadius: '10px', padding: '4px' }} className="flex gap-1">
            {DANGERS.map(d => {
              const active = data.niveauDanger === d.id
              return (
                <button
                  key={d.id}
                  onClick={() => set('niveauDanger', d.id)}
                  style={{
                    flex: 1, minHeight: '40px', borderRadius: '8px',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.5px', fontWeight: 600,
                    background: active ? 'var(--surface)' : 'transparent',
                    color: active ? d.color : 'var(--text-muted)',
                    border: active ? `1.5px solid ${d.color}` : '1.5px solid transparent',
                    boxShadow: active ? 'var(--shadow-seg-active)' : 'none',
                    cursor: 'pointer', transition: 'all .15s ease',
                  }}
                >
                  {d.label}
                </button>
              )
            })}
          </div>
        </Field>
      </div>

      <Field label="Objectif *">
        <textarea value={data.objectif} onChange={e => set('objectif', e.target.value)} rows={3}
          placeholder="Ce qu'on cherche à éviter (ex : asphyxie, choc)..." style={inputStyle} className="w-full px-4 py-3 outline-none resize-none" />
      </Field>

      <Field label="Conditions d'activation">
        <textarea value={data.conditionsActivation} onChange={e => set('conditionsActivation', e.target.value)} rows={2}
          placeholder="Quand activer cette procédure..." style={inputStyle} className="w-full px-4 py-3 outline-none resize-none" />
      </Field>

      <Field label="Actions immédiates (1 par ligne)">
        {data.actionsImmédiates.map((a, i) => (
          <input key={i} type="text" value={a} onChange={e => set('actionsImmédiates', data.actionsImmédiates.map((x, j) => j === i ? e.target.value : x))}
            placeholder={`Action ${i + 1}...`} style={{ ...inputStyle, marginBottom: '6px' }} className="w-full px-4 py-2.5 outline-none" />
        ))}
      </Field>

      <Field label="Procédure étape par étape">
        {data.procedureAction.map((e, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 700, minWidth: '24px' }}>{e.etape}.</span>
            <input type="text" value={e.action} onChange={ev => updateEtape(i, ev.target.value)}
              placeholder={`Étape ${e.etape}...`} style={inputStyle} className="flex-1 px-4 py-2.5 outline-none" />
          </div>
        ))}
        <button onClick={addEtape} style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          + Ajouter une étape
        </button>
      </Field>

      <Field label="Tags (séparés par des virgules)">
        <input type="text" value={data.tagsInput} onChange={e => set('tagsInput', e.target.value)}
          placeholder="urgence, malaise, choc..." style={inputStyle} className="w-full px-4 py-3 outline-none" />
      </Field>

      <button onClick={handleSave}
        style={{ backgroundColor: 'var(--ink)', fontSize: '15px', minHeight: '52px', borderRadius: 'var(--radius-control)' }}
        className="w-full text-white font-semibold hover:bg-[var(--ink-hover)] transition-colors">
        Continuer dans l'éditeur
      </button>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ color: 'var(--text-secondary)', fontSize: '12px', letterSpacing: '0.5px' }} className="block mb-2 uppercase tracking-wider font-medium">{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  backgroundColor: 'var(--surface-input)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-control)',
  color: 'var(--text)',
  fontSize: '15px',
  fontFamily: 'var(--font-body)',
}
