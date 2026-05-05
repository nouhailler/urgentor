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

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 w-full">
      <div className="mb-6">
        <h1 style={{ fontFamily: 'Oswald, sans-serif', color: '#CC0000', fontSize: '28px', letterSpacing: '2px', marginBottom: '4px' }}>
          NOUVELLE FICHE
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '15px' }}>
          Créez une fiche personnalisée avec l'IA ou manuellement.
        </p>
      </div>

      {/* Sélecteur de mode */}
      <div style={{ backgroundColor: '#16213e', border: '1px solid #2a2a4a' }} className="rounded-lg p-1 flex mb-6">
        <button
          onClick={() => setMode('ai')}
          style={{
            backgroundColor: mode === 'ai' ? '#CC0000' : 'transparent',
            color: mode === 'ai' ? '#FFFFFF' : '#9ca3af',
            fontSize: '15px',
            minHeight: '44px'
          }}
          className="flex-1 rounded font-semibold transition-colors"
        >
          🤖 Génération IA
        </button>
        <button
          onClick={() => setMode('manual')}
          style={{
            backgroundColor: mode === 'manual' ? '#CC0000' : 'transparent',
            color: mode === 'manual' ? '#FFFFFF' : '#9ca3af',
            fontSize: '15px',
            minHeight: '44px'
          }}
          className="flex-1 rounded font-semibold transition-colors"
        >
          ✏️ Saisie manuelle
        </button>
      </div>

      {mode === 'ai' ? (
        <AIGenerator onFicheGenerated={handleFicheGenerated} />
      ) : (
        <ManualForm onSave={handleFicheGenerated} />
      )}
    </main>
  )
}

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
    <div style={{ backgroundColor: '#16213e', border: '1px solid #2a2a4a' }} className="rounded-lg p-5 flex flex-col gap-5">
      <Field label="Titre *">
        <input type="text" value={data.titre} onChange={e => set('titre', e.target.value)}
          placeholder="Titre de la fiche..." style={inputStyle} className="w-full px-4 py-3 rounded border outline-none" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Catégorie">
          <select value={data.categorie} onChange={e => set('categorie', e.target.value)} style={inputStyle} className="w-full px-4 py-3 rounded border outline-none">
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.icone} {c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Niveau de danger">
          <select value={data.niveauDanger} onChange={e => set('niveauDanger', e.target.value)} style={inputStyle} className="w-full px-4 py-3 rounded border outline-none">
            <option value="standard">Standard</option>
            <option value="élevé">Élevé</option>
            <option value="critique">Critique</option>
          </select>
        </Field>
      </div>

      <Field label="Objectif *">
        <textarea value={data.objectif} onChange={e => set('objectif', e.target.value)} rows={3}
          placeholder="Objectif de la fiche..." style={inputStyle} className="w-full px-4 py-3 rounded border outline-none resize-none" />
      </Field>

      <Field label="Conditions d'activation">
        <textarea value={data.conditionsActivation} onChange={e => set('conditionsActivation', e.target.value)} rows={2}
          placeholder="Quand activer cette procédure..." style={inputStyle} className="w-full px-4 py-3 rounded border outline-none resize-none" />
      </Field>

      <Field label="Actions immédiates (1 par ligne)">
        {data.actionsImmédiates.map((a, i) => (
          <input key={i} type="text" value={a} onChange={e => set('actionsImmédiates', data.actionsImmédiates.map((x, j) => j === i ? e.target.value : x))}
            placeholder={`Action ${i + 1}...`} style={{ ...inputStyle, marginBottom: '6px' }} className="w-full px-4 py-2 rounded border outline-none" />
        ))}
      </Field>

      <Field label="Procédure étape par étape">
        {data.procedureAction.map((e, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <span style={{ color: '#CC0000', fontFamily: 'Oswald, sans-serif', minWidth: '24px' }}>{e.etape}.</span>
            <input type="text" value={e.action} onChange={ev => updateEtape(i, ev.target.value)}
              placeholder={`Étape ${e.etape}...`} style={inputStyle} className="flex-1 px-4 py-2 rounded border outline-none" />
          </div>
        ))}
        <button onClick={addEtape} style={{ color: '#CC0000', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          + Ajouter une étape
        </button>
      </Field>

      <Field label="Tags (séparés par des virgules)">
        <input type="text" value={data.tagsInput} onChange={e => set('tagsInput', e.target.value)}
          placeholder="urgence, malaise, choc..." style={inputStyle} className="w-full px-4 py-3 rounded border outline-none" />
      </Field>

      <button onClick={handleSave}
        style={{ backgroundColor: '#CC0000', fontSize: '16px', minHeight: '52px' }}
        className="w-full rounded text-white font-bold hover:bg-red-700 transition-colors">
        💾 Sauvegarder la fiche
      </button>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ color: '#9ca3af', fontSize: '13px' }} className="block mb-2 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  backgroundColor: '#0a0a1a',
  borderColor: '#2a2a4a',
  color: '#f0f0f0',
  fontSize: '15px'
}
