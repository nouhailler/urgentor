import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/categories'
import { loadSettings, PROVIDERS } from '../hooks/useSettings'
import { loadCachedORModels } from '../hooks/useOpenRouterModels'

const SYSTEM_PROMPT = `Tu es un expert en premiers secours et en gestion de risques NRBC. Génère une fiche de premiers secours complète au format JSON strict.

La fiche doit suivre ce schéma exact (remplis TOUS les champs pertinents) :
{
  "id": "slug-unique",
  "titre": "string",
  "categorie": "secours-personne|incendie-evacuation|chimique|nrbc",
  "sousCategorie": "string",
  "tags": ["array", "de", "tags"],
  "niveauDanger": "standard|élevé|critique",
  "dateCreation": "ISO8601",
  "source": "ia-generee",
  "referentielSource": "HAS|INRS|Ministère Intérieur|INERIS",
  "objectif": "string",
  "conditionsActivation": "string",
  "nrbc": { "type": "N|R|B|C", "agent": "string", "codeNU": "string", "classificationADR": "string", "zoneExclusion": "string", "niveauEPI": "string", "antidoteDisponible": bool, "decontaminationRequise": bool, "protocolePCO": "string" },
  "chimique": { "produit": "string", "formePhysique": "string", "voiesExposition": [], "symptomesIntoxication": [], "seuilOlfactif": "string", "seuilDanger": "string", "seuilLCLO": "string", "epiMinimum": "string", "incompatibilites": [] },
  "diagnosticRapide": { "visuels": [], "auditifs": [], "comportementaux": [] },
  "securiteAvantAction": { "risquesPourIntervenant": [], "equipementsRequis": [], "regleUniverselle": "string", "zoneChaudeInterditeSansEPI": bool },
  "zonesIntervention": { "zoneRouge": "string", "zoneOrange": "string", "zoneVerte": "string" },
  "scriptAlerte": { "numero": "string", "quoiDire": "string", "informationsAFournir": [] },
  "actionsImmédiates": ["max 4 actions courtes"],
  "procedureAction": [{"etape": 1, "action": "string"}],
  "decontamination": { "requise": bool, "protocole": "string", "pointDecontamination": "string", "gestionVetements": "string" },
  "arbresDecision": [{"condition": "string", "alors": "string"}],
  "notesCritiques": [],
  "pointsControle": [],
  "conditionsArretEscalade": [],
  "siSecoursTardent": {
    "contexte": "Si les secours sont à plus de X min...",
    "actions": ["Action à réaliser en autonomie"],
    "ressourcesImprovises": ["Matériau de substitution > équipement idéal"],
    "signesAggravation": ["Signe critique nécessitant une action immédiate"],
    "limitesSansSecours": "Description des limites absolues sans médecin",
    "avertissement": "⚠️ Ces mesures sont des solutions de dernier recours..."
  },
  "ressourcesNecessaires": [],
  "avertissement": "string"
}

Pour les fiches chimiques et NRBC : remplis OBLIGATOIREMENT les champs nrbc/chimique avec données réelles (codes NU, seuils ppm, EPI niveau).
Réponds UNIQUEMENT avec le JSON brut, sans markdown, sans texte avant ou après.`

async function callAnthropic({ key, model, systemPrompt, userPrompt }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  })
  if (!res.ok) {
    const d = await res.json()
    throw new Error(d.error?.message ?? `HTTP ${res.status}`)
  }
  const d = await res.json()
  return d.content[0]?.text ?? ''
}

async function callOpenAI({ key, model, systemPrompt, userPrompt }) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  })
  if (!res.ok) {
    const d = await res.json()
    throw new Error(d.error?.message ?? `HTTP ${res.status}`)
  }
  const d = await res.json()
  return d.choices[0]?.message?.content ?? ''
}

async function callOpenRouter({ key, model, systemPrompt, userPrompt }) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://urgentor.app',
      'X-Title': 'Urgentor'
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  })
  if (!res.ok) {
    const d = await res.json()
    throw new Error(d.error?.message ?? `HTTP ${res.status}`)
  }
  const d = await res.json()
  return d.choices[0]?.message?.content ?? ''
}

const API_CALLERS = {
  anthropic: callAnthropic,
  openai: callOpenAI,
  openrouter: callOpenRouter
}

const fieldLabel = { color: 'var(--text-secondary)', fontSize: '12px', letterSpacing: '0.5px' }
const inputStyle = {
  backgroundColor: 'var(--surface-input)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-control)',
  color: 'var(--text)',
  fontFamily: 'var(--font-body)',
}

export default function AIGenerator({ onFicheGenerated }) {
  const settings = loadSettings()
  const cachedOR = loadCachedORModels()
  const configuredProviders = Object.keys(PROVIDERS).filter(p => !!settings[p]?.key?.trim())

  const [titre, setTitre] = useState('')
  const [categorie, setCategorie] = useState('secours-personne')
  const [produit, setProduit] = useState('')
  const [provider, setProvider] = useState(configuredProviders[0] ?? '')
  const [model, setModel] = useState(
    configuredProviders[0] ? settings[configuredProviders[0]].model : ''
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  const needsProduit = categorie === 'chimique' || categorie === 'nrbc'

  const getModelsForProvider = (p) => {
    if (p === 'openrouter') return cachedOR.models
    return PROVIDERS[p]?.models ?? []
  }

  const handleProviderChange = (p) => {
    setProvider(p)
    const savedModel = settings[p]?.model
    const models = getModelsForProvider(p)
    const exists = models.some(m => m.id === savedModel)
    setModel(exists ? savedModel : (models[0]?.id ?? ''))
    setError('')
  }

  const generate = async () => {
    if (!titre.trim()) { setError('Le titre est requis'); return }
    if (!provider) { setError('Aucun fournisseur sélectionné'); return }
    const key = settings[provider]?.key
    if (!key?.trim()) { setError(`Clé API ${PROVIDERS[provider]?.label} manquante — configurez-la dans Paramètres`); return }

    setLoading(true)
    setError('')
    setPreview(null)

    const userPrompt = `Génère une fiche de premiers secours pour : "${titre}"
Catégorie : ${categorie}${needsProduit && produit ? `\nProduit/Agent : ${produit}` : ''}`

    try {
      const caller = API_CALLERS[provider]
      const text = await caller({ key, model, systemPrompt: SYSTEM_PROMPT, userPrompt })

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Réponse non JSON — essayez un autre modèle')
      const fiche = JSON.parse(jsonMatch[0])
      fiche.id = fiche.id || `ia-${Date.now()}`
      fiche.dateCreation = new Date().toISOString()
      setPreview(fiche)
    } catch (e) {
      setError(`Erreur : ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const accepter = () => {
    if (preview) {
      onFicheGenerated(preview)
      setPreview(null)
      setTitre('')
      setProduit('')
    }
  }

  // Aucune clé configurée
  if (configuredProviders.length === 0) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)' }} className="p-8 text-center flex flex-col items-center gap-4">
        <div className="text-4xl">⚙️</div>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '20px', fontWeight: 700 }}>
          Aucune clé API configurée
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '380px', lineHeight: 1.6 }}>
          Configurez au moins une clé API (Anthropic, OpenAI ou OpenRouter) pour pouvoir générer des fiches.
        </div>
        <Link
          to="/parametres"
          style={{ backgroundColor: 'var(--ink)', fontSize: '15px', textDecoration: 'none', minHeight: '48px', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-control)' }}
          className="px-6 text-white font-semibold hover:bg-[var(--ink-hover)] transition-colors"
        >
          → Aller aux Paramètres
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)' }} className="p-6">
        <div className="flex flex-col gap-4">
          {/* Sélecteur fournisseur */}
          <div>
            <label style={fieldLabel} className="block mb-2 uppercase tracking-wider font-medium">Fournisseur IA</label>
            <div className="flex gap-2 flex-wrap">
              {configuredProviders.map(p => {
                const cfg = PROVIDERS[p]
                const active = provider === p
                return (
                  <button
                    key={p}
                    onClick={() => handleProviderChange(p)}
                    style={{
                      backgroundColor: active ? 'var(--accent-soft)' : 'var(--surface)',
                      border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border-strong)'}`,
                      color: active ? 'var(--accent-deep)' : 'var(--text-body)',
                      fontSize: '14px', minHeight: '40px', borderRadius: 'var(--radius-control)',
                    }}
                    className="px-4 py-2 font-medium transition-colors flex items-center gap-2"
                  >
                    {cfg.label}
                  </button>
                )
              })}
              <Link
                to="/parametres"
                style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none', minHeight: '40px', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-control)' }}
                className="btn-outline px-3"
              >
                ⚙️ Gérer
              </Link>
            </div>
          </div>

          {/* Sélecteur modèle */}
          {provider && (
            <div>
              <label style={fieldLabel} className="block mb-2 uppercase tracking-wider font-medium">Modèle IA</label>
              {provider === 'openrouter' && cachedOR.models.length === 0 ? (
                <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--panel-warn-border)', color: 'var(--warning)', fontSize: '14px', borderRadius: 'var(--radius-control)' }} className="px-4 py-3 flex items-center justify-between gap-3">
                  <span>Aucun modèle chargé</span>
                  <Link to="/parametres" style={{ color: 'var(--accent)', fontSize: '13px', textDecoration: 'none', flexShrink: 0 }}>
                    → Actualiser dans Paramètres
                  </Link>
                </div>
              ) : (
                <select value={model} onChange={e => setModel(e.target.value)} style={inputStyle} className="w-full px-4 py-3 outline-none">
                  {provider === 'openrouter'
                    ? cachedOR.models.map(m => (<option key={m.id} value={m.id}>{m.name}</option>))
                    : PROVIDERS[provider]?.models.map(m => (<option key={m.id} value={m.id}>{m.label}</option>))
                  }
                </select>
              )}
            </div>
          )}

          {/* Titre */}
          <div>
            <label style={fieldLabel} className="block mb-2 uppercase tracking-wider font-medium">Titre de la fiche *</label>
            <input
              type="text"
              value={titre}
              onChange={e => setTitre(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="ex : Morsure de serpent, Intoxication au chlore..."
              style={{ ...inputStyle, fontSize: '16px' }}
              className="w-full px-4 py-3 outline-none"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label style={fieldLabel} className="block mb-2 uppercase tracking-wider font-medium">Catégorie *</label>
            <select value={categorie} onChange={e => setCategorie(e.target.value)} style={{ ...inputStyle, fontSize: '16px' }} className="w-full px-4 py-3 outline-none">
              {CATEGORIES.map(c => (<option key={c.id} value={c.id}>{c.icone} {c.label}</option>))}
            </select>
          </div>

          {/* Produit chimique/NRBC */}
          {needsProduit && (
            <div>
              <label style={{ color: 'var(--cat-chimique)', fontSize: '12px', letterSpacing: '0.5px' }} className="block mb-2 uppercase tracking-wider font-medium">☣️ Nom du produit / agent</label>
              <input
                type="text"
                value={produit}
                onChange={e => setProduit(e.target.value)}
                placeholder="ex : Acide nitrique, Sarin, Césium-137..."
                style={{ ...inputStyle, fontSize: '16px' }}
                className="w-full px-4 py-3 outline-none"
              />
            </div>
          )}

          {/* Notice clé API */}
          <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--panel-warn-border)', color: 'var(--warning)', fontSize: '13px', borderRadius: 'var(--radius-control)' }} className="px-4 py-2.5 flex items-center gap-2">
            <span>ⓘ</span> Une clé API est requise.
            <Link to="/parametres" style={{ color: 'var(--warning)', fontWeight: 600, textDecoration: 'underline' }}>Paramètres</Link>
          </div>

          {error && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--panel-action-border)', color: 'var(--danger)', fontSize: '14px', borderRadius: 'var(--radius-control)' }} className="p-3">
              {error}
              {error.includes('Paramètres') && (
                <Link to="/parametres" style={{ color: 'var(--danger)', marginLeft: '8px', fontWeight: 600, textDecoration: 'underline' }}>→ Paramètres</Link>
              )}
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading}
            style={{ backgroundColor: loading ? 'var(--text-muted)' : 'var(--ink)', fontSize: '16px', minHeight: '52px', borderRadius: 'var(--radius-control)' }}
            className="w-full text-white font-semibold py-3 hover:bg-[var(--ink-hover)] transition-colors disabled:cursor-not-allowed"
          >
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Génération en cours…
                </span>
              : '✦ Générer la fiche'
            }
          </button>
        </div>
      </div>

      {/* Prévisualisation */}
      {preview ? (
        <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', borderRadius: 'var(--radius-card)' }} className="p-5">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--success)', fontSize: '16px', fontWeight: 800, marginBottom: '12px' }} className="uppercase">
            ✅ Fiche générée — Prévisualisation
          </h3>
          <div style={{ color: 'var(--text)', fontSize: '18px', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '4px' }}>
            {preview.titre}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
            {preview.objectif}
          </div>
          <pre
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-body)', fontSize: '11px', fontFamily: 'var(--font-mono)', overflowX: 'auto', maxHeight: '280px', borderRadius: 'var(--radius-inner)' }}
            className="p-4"
          >
            {JSON.stringify(preview, null, 2)}
          </pre>
          <div className="flex gap-3 mt-4">
            <button onClick={accepter} style={{ backgroundColor: 'var(--success)', fontSize: '15px', minHeight: '48px', flex: 1, borderRadius: 'var(--radius-control)' }} className="text-white font-semibold hover:brightness-105 transition-all">
              ✅ Accepter et sauvegarder
            </button>
            <button onClick={() => setPreview(null)} style={{ fontSize: '15px', minHeight: '48px', flex: 1, borderRadius: 'var(--radius-control)' }} className="btn-outline font-semibold">
              Rejeter
            </button>
          </div>
        </div>
      ) : (
        <div style={{ border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-card)', color: 'var(--text-faint)' }} className="p-10 text-center text-sm">
          La fiche générée s'affichera ici pour prévisualisation avant sauvegarde.
        </div>
      )}
    </div>
  )
}
