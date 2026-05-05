import { useState, useRef, useEffect } from 'react'
import NRBCBadge from './NRBCBadge'
import DiagramVisuel from './DiagramVisuel'
import { getCategorieById } from '../data/categories'
import { useNotes } from '../hooks/useNotes'

function Section({ title, children, color = '#2a2a4a', borderColor }) {
  return (
    <div
      style={{ backgroundColor: color, borderLeft: borderColor ? `4px solid ${borderColor}` : undefined }}
      className="rounded-lg p-5"
    >
      <h2 style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0', fontSize: '16px', letterSpacing: '1px', marginBottom: '12px' }} className="uppercase">
        {title}
      </h2>
      {children}
    </div>
  )
}

function EtapeItem({ etape, action }) {
  return (
    <div className="flex gap-3 items-start">
      <div
        style={{ backgroundColor: '#CC0000', minWidth: '28px', height: '28px', fontFamily: 'Oswald, sans-serif', fontSize: '14px' }}
        className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-0.5"
      >
        {etape}
      </div>
      <div style={{ color: '#e0e0e0', fontSize: '15px', lineHeight: '1.6' }}>{action}</div>
    </div>
  )
}

export default function FicheDetail({ fiche }) {
  const categorie = getCategorieById(fiche.categorie)
  const isNRBC = fiche.categorie === 'nrbc'
  const isChimique = fiche.categorie === 'chimique'
  const isDangerous = isNRBC || isChimique

  return (
    <article className="flex flex-col gap-5 pb-10">

      {/* Bandeau avertissement clignotant */}
      {isDangerous && (
        <div
          className="bandeau-danger rounded-lg px-5 py-4 text-center font-bold"
          style={{
            backgroundColor: '#CC0000',
            color: '#FFFFFF',
            fontFamily: 'Oswald, sans-serif',
            fontSize: '16px',
            letterSpacing: '1px'
          }}
        >
          ⚠️ INTERVENTION RÉSERVÉE AUX PERSONNELS FORMÉS ET ÉQUIPÉS ⚠️
        </div>
      )}

      {/* En-tête fiche */}
      <div
        style={{ backgroundColor: categorie?.couleur ?? '#CC0000', padding: '20px 24px' }}
        className={`rounded-lg ${isNRBC ? 'nrbc-border' : ''}`}
      >
        <div className={isNRBC ? 'nrbc-border-inner p-4 rounded' : ''}>
          <div className="flex items-start gap-3 flex-wrap">
            <span className="text-4xl">{categorie?.icone}</span>
            <div className="flex-1">
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '2px' }} className="uppercase mb-1">
                {categorie?.label}
              </div>
              <h1 style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF', fontSize: '28px', lineHeight: 1.2, margin: 0 }}>
                {fiche.titre}
              </h1>
            </div>
            {isNRBC && fiche.nrbc?.type && (
              <NRBCBadge type={fiche.nrbc.type} niveauEPI={fiche.nrbc.niveauEPI} />
            )}
          </div>

          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginTop: '12px', lineHeight: '1.6' }}>
            {fiche.objectif}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {fiche.tags?.map(tag => (
              <span key={tag} style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.8)', fontSize: '12px' }} className="px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Conditions d'activation */}
      {fiche.conditionsActivation && (
        <Section title="🎯 Conditions d'activation" borderColor="#F39C12">
          <p style={{ color: '#e0e0e0', fontSize: '15px', lineHeight: '1.6' }}>{fiche.conditionsActivation}</p>
        </Section>
      )}

      {/* Infos produit NRBC */}
      {isNRBC && fiche.nrbc && (
        <div
          style={{ backgroundColor: '#1a1000', border: '2px solid #FFD700' }}
          className="rounded-lg p-5"
        >
          <h2 style={{ fontFamily: 'Oswald, sans-serif', color: '#FFD700', fontSize: '16px', letterSpacing: '1px', marginBottom: '12px' }} className="uppercase">
            ☢️ Informations NRBC
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {fiche.nrbc.agent && <InfoField label="Agent" value={fiche.nrbc.agent} />}
            {fiche.nrbc.codeNU && <InfoField label="Code NU" value={fiche.nrbc.codeNU} mono />}
            {fiche.nrbc.classificationADR && <InfoField label="Classif. ADR" value={fiche.nrbc.classificationADR} />}
            {fiche.nrbc.zoneExclusion && <InfoField label="Zone exclusion" value={fiche.nrbc.zoneExclusion} color="#CC0000" />}
            {fiche.nrbc.niveauEPI && <InfoField label="EPI requis" value={fiche.nrbc.niveauEPI.split('—')[0].trim()} color="#FF6B35" />}
            {fiche.nrbc.decontaminationRequise !== undefined && (
              <InfoField label="Décontam." value={fiche.nrbc.decontaminationRequise ? 'OBLIGATOIRE' : 'Non requise'} color={fiche.nrbc.decontaminationRequise ? '#CC0000' : '#2ECC71'} />
            )}
          </div>
        </div>
      )}

      {/* Infos produit chimique */}
      {(isChimique || (isNRBC && fiche.chimique)) && fiche.chimique && (
        <div
          style={{ backgroundColor: '#150028', border: '2px solid #8B00FF' }}
          className="rounded-lg p-5"
        >
          <h2 style={{ fontFamily: 'Oswald, sans-serif', color: '#8B00FF', fontSize: '16px', letterSpacing: '1px', marginBottom: '12px' }} className="uppercase">
            ☣️ Données chimiques
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {fiche.chimique.produit && <InfoField label="Produit" value={fiche.chimique.produit} />}
            {fiche.chimique.seuilOlfactif && <InfoField label="Seuil olfactif" value={fiche.chimique.seuilOlfactif} mono />}
            {fiche.chimique.seuilDanger && <InfoField label="Seuil danger" value={fiche.chimique.seuilDanger} mono color="#F39C12" />}
            {fiche.chimique.seuilLCLO && <InfoField label="Seuil LCLO" value={fiche.chimique.seuilLCLO} mono color="#CC0000" />}
            {fiche.chimique.epiMinimum && <InfoField label="EPI minimum" value={fiche.chimique.epiMinimum} color="#FF6B35" />}
          </div>
          {fiche.chimique.symptomesIntoxication?.length > 0 && (
            <div className="mt-4">
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }} className="uppercase tracking-wider">Symptômes</div>
              <div className="flex flex-wrap gap-2">
                {fiche.chimique.symptomesIntoxication.map((s, i) => (
                  <span key={i} style={{ backgroundColor: '#2d0060', color: '#c084fc', fontSize: '13px' }} className="px-2 py-1 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Zones d'intervention */}
      {(isNRBC || isChimique) && fiche.zonesIntervention && (
        <Section title="🗺️ Zones d'intervention">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ZoneCard couleur="#CC0000" label="ZONE ROUGE" texte={fiche.zonesIntervention.zoneRouge} />
            <ZoneCard couleur="#FF6B35" label="ZONE ORANGE" texte={fiche.zonesIntervention.zoneOrange} />
            <ZoneCard couleur="#2ECC71" label="ZONE VERTE" texte={fiche.zonesIntervention.zoneVerte} />
          </div>
        </Section>
      )}

      {/* Diagnostic rapide */}
      {fiche.diagnosticRapide && (
        <Section title="🔍 Diagnostic rapide" borderColor="#F39C12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DiagCol icone="👁" label="Visuels" items={fiche.diagnosticRapide.visuels} />
            <DiagCol icone="👂" label="Auditifs" items={fiche.diagnosticRapide.auditifs} />
            <DiagCol icone="🧠" label="Comportements" items={fiche.diagnosticRapide.comportementaux} />
          </div>
        </Section>
      )}

      {/* Sécurité avant action */}
      {fiche.securiteAvantAction && (
        <div style={{ backgroundColor: '#2a1500', border: '2px solid #FF6B35' }} className="rounded-lg p-5">
          <h2 style={{ fontFamily: 'Oswald, sans-serif', color: '#FF6B35', fontSize: '16px', letterSpacing: '1px', marginBottom: '12px' }} className="uppercase">
            ⚠️ Sécurité avant action
          </h2>
          <div
            style={{ backgroundColor: '#1a0a00', borderLeft: '4px solid #FF6B35', fontSize: '15px', color: '#f0e0d0' }}
            className="rounded p-4 mb-4 font-semibold"
          >
            {fiche.securiteAvantAction.regleUniverselle}
          </div>
          {fiche.securiteAvantAction.risquesPourIntervenant?.length > 0 && (
            <div className="mb-3">
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }} className="uppercase tracking-wider">Risques</div>
              <ul className="space-y-1">
                {fiche.securiteAvantAction.risquesPourIntervenant.map((r, i) => (
                  <li key={i} style={{ color: '#e0a070', fontSize: '14px' }} className="flex gap-2">
                    <span>▸</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {fiche.securiteAvantAction.equipementsRequis?.length > 0 && (
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }} className="uppercase tracking-wider">Équipements requis</div>
              <ul className="space-y-1">
                {fiche.securiteAvantAction.equipementsRequis.map((e, i) => (
                  <li key={i} style={{ color: '#70c0e0', fontSize: '14px' }} className="flex gap-2">
                    <span>✓</span>{e}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Script d'alerte */}
      {fiche.scriptAlerte && (
        <div style={{ backgroundColor: '#0a0a1a', border: '2px solid #CC0000' }} className="rounded-lg p-5">
          <h2 style={{ fontFamily: 'Oswald, sans-serif', color: '#CC0000', fontSize: '16px', letterSpacing: '1px', marginBottom: '12px' }} className="uppercase">
            📞 Script d'alerte
          </h2>
          <div style={{ backgroundColor: '#1a0010', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px' }}>
            <div style={{ color: '#FF6B35', fontFamily: 'IBM Plex Mono, monospace', fontSize: '22px', fontWeight: 700, letterSpacing: '2px' }}>
              {fiche.scriptAlerte.numero}
            </div>
          </div>
          <div
            style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', color: '#d0d0d0', backgroundColor: '#141428', lineHeight: 1.8 }}
            className="rounded p-4"
          >
            {fiche.scriptAlerte.quoiDire}
          </div>
          {fiche.scriptAlerte.informationsAFournir?.length > 0 && (
            <div className="mt-3">
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }} className="uppercase tracking-wider">Informations à fournir</div>
              <ul className="space-y-1">
                {fiche.scriptAlerte.informationsAFournir.map((info, i) => (
                  <li key={i} style={{ color: '#e0e0e0', fontSize: '14px' }} className="flex gap-2">
                    <span style={{ color: '#CC0000' }}>→</span>{info}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Actions immédiates */}
      {fiche.actionsImmédiates && (
        <div style={{ backgroundColor: '#1a0000', border: '3px solid #CC0000' }} className="rounded-lg p-5">
          <h2 style={{ fontFamily: 'Oswald, sans-serif', color: '#CC0000', fontSize: '18px', letterSpacing: '2px', marginBottom: '12px' }} className="uppercase">
            ⚡ Actions immédiates — 3 minutes max
          </h2>
          <ol className="space-y-2">
            {fiche.actionsImmédiates.map((action, i) => (
              <li key={i} style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 600 }} className="flex gap-3 items-start">
                <span style={{ color: '#CC0000', fontFamily: 'Oswald, sans-serif', fontSize: '20px', lineHeight: 1, minWidth: '24px' }}>{i + 1}.</span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Procédure d'action */}
      {fiche.procedureAction && (
        <Section title="📋 Procédure d'action" borderColor="#CC0000">
          <div className="flex flex-col gap-3">
            {fiche.procedureAction.map((e) => (
              <EtapeItem key={e.etape} etape={e.etape} action={e.action} />
            ))}
          </div>
        </Section>
      )}

      {/* Décontamination */}
      {fiche.decontamination?.requise && (
        <div style={{ backgroundColor: '#150028', border: '2px solid #8B00FF' }} className="rounded-lg p-5">
          <h2 style={{ fontFamily: 'Oswald, sans-serif', color: '#c084fc', fontSize: '16px', letterSpacing: '1px', marginBottom: '12px' }} className="uppercase">
            🧪 Décontamination
          </h2>
          <div style={{ color: '#e0e0e0', fontSize: '15px', lineHeight: 1.7 }}>
            {fiche.decontamination.protocole}
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fiche.decontamination.pointDecontamination && (
              <InfoField label="Point décontam." value={fiche.decontamination.pointDecontamination} />
            )}
            {fiche.decontamination.gestionVetements && (
              <InfoField label="Gestion vêtements" value={fiche.decontamination.gestionVetements} />
            )}
          </div>
        </div>
      )}

      {/* Arbre de décision */}
      {fiche.arbresDecision?.length > 0 && (
        <Section title="🌿 Arbre de décision" borderColor="#F39C12">
          <DiagramVisuel arbresDecision={fiche.arbresDecision} />
        </Section>
      )}

      {/* Notes critiques */}
      {fiche.notesCritiques?.length > 0 && (
        <div style={{ backgroundColor: '#1a0a00', border: '2px solid #FF6B35' }} className="rounded-lg p-5">
          <h2 style={{ fontFamily: 'Oswald, sans-serif', color: '#FF6B35', fontSize: '16px', letterSpacing: '1px', marginBottom: '12px' }} className="uppercase">
            🔴 Notes critiques
          </h2>
          <ul className="space-y-2">
            {fiche.notesCritiques.map((note, i) => (
              <li key={i} style={{ color: '#f0d0b0', fontSize: '15px', borderLeft: '3px solid #FF6B35', paddingLeft: '12px' }}>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Points de contrôle */}
      {fiche.pointsControle?.length > 0 && (
        <Section title="✅ Points de contrôle" borderColor="#2ECC71">
          <ul className="space-y-2">
            {fiche.pointsControle.map((pt, i) => (
              <li key={i} style={{ color: '#b0e0c0', fontSize: '15px' }} className="flex gap-2 items-start">
                <span style={{ color: '#2ECC71', marginTop: '2px' }}>☑</span>
                {pt}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Conditions d'arrêt / escalade */}
      {fiche.conditionsArretEscalade?.length > 0 && (
        <Section title="⬆️ Escalade" borderColor="#F39C12">
          <ul className="space-y-2">
            {fiche.conditionsArretEscalade.map((c, i) => (
              <li key={i} style={{ color: '#e0d080', fontSize: '15px' }} className="flex gap-2">
                <span style={{ color: '#F39C12' }}>▲</span>{c}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Ressources nécessaires */}
      {fiche.ressourcesNecessaires?.length > 0 && (
        <Section title="🧰 Ressources nécessaires">
          <div className="flex flex-wrap gap-2">
            {fiche.ressourcesNecessaires.map((r, i) => (
              <span key={i} style={{ backgroundColor: '#1e2a4a', color: '#b0c4de', fontSize: '13px' }} className="px-3 py-1.5 rounded border border-gray-700">
                {r}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* ── SI LES SECOURS TARDENT ───────────────────────────────── */}
      {fiche.siSecoursTardent && (
        <div
          style={{
            backgroundColor: '#1a1200',
            border: '2px solid #F39C12',
            boxShadow: '0 0 20px rgba(243,156,18,0.15)'
          }}
          className="rounded-lg p-5"
        >
          <h2 style={{ fontFamily: 'Oswald, sans-serif', color: '#F39C12', fontSize: '18px', letterSpacing: '1px', marginBottom: '6px' }} className="uppercase flex items-center gap-2">
            🕐 Si les secours tardent — Zone isolée
          </h2>
          {fiche.siSecoursTardent.contexte && (
            <p style={{ color: '#c0a060', fontSize: '14px', marginBottom: '16px', fontStyle: 'italic' }}>
              {fiche.siSecoursTardent.contexte}
            </p>
          )}

          {/* Actions de dernier recours */}
          {fiche.siSecoursTardent.actions?.length > 0 && (
            <div className="mb-4">
              <div style={{ color: '#F39C12', fontSize: '12px', marginBottom: '8px' }} className="uppercase tracking-wider">
                Actions possibles
              </div>
              <ul className="space-y-2">
                {fiche.siSecoursTardent.actions.map((a, i) => (
                  <li key={i} style={{ color: '#e8d080', fontSize: '14px', lineHeight: 1.6 }} className="flex gap-2 items-start">
                    <span style={{ color: '#F39C12', fontFamily: 'Oswald, sans-serif', fontWeight: 700, minWidth: '20px' }}>{i + 1}.</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ressources improvisées */}
            {fiche.siSecoursTardent.ressourcesImprovises?.length > 0 && (
              <div>
                <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }} className="uppercase tracking-wider">🧰 Ressources de fortune</div>
                <ul className="space-y-1.5">
                  {fiche.siSecoursTardent.ressourcesImprovises.map((r, i) => (
                    <li key={i} style={{ color: '#c0c0a0', fontSize: '13px', lineHeight: 1.5 }} className="flex gap-2">
                      <span style={{ color: '#F39C12' }}>→</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Signes d'aggravation */}
            {fiche.siSecoursTardent.signesAggravation?.length > 0 && (
              <div>
                <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }} className="uppercase tracking-wider">⚠️ Signes d'aggravation</div>
                <ul className="space-y-1.5">
                  {fiche.siSecoursTardent.signesAggravation.map((s, i) => (
                    <li key={i} style={{ color: '#ff9999', fontSize: '13px', lineHeight: 1.5 }} className="flex gap-2">
                      <span style={{ color: '#CC0000' }}>▲</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Limites sans secours */}
          {fiche.siSecoursTardent.limitesSansSecours && (
            <div style={{ backgroundColor: '#2a1a00', borderLeft: '3px solid #F39C12', marginTop: '14px' }} className="rounded p-3">
              <div style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '4px' }} className="uppercase tracking-wider">Limites sans prise en charge médicale</div>
              <div style={{ color: '#d0c080', fontSize: '14px', lineHeight: 1.6 }}>
                {fiche.siSecoursTardent.limitesSansSecours}
              </div>
            </div>
          )}

          {/* Avertissement dernier recours */}
          <div style={{ backgroundColor: '#111', border: '1px solid #444', color: '#888', fontSize: '12px', lineHeight: 1.6, marginTop: '12px' }} className="rounded p-3">
            ⚠️ {fiche.siSecoursTardent.avertissement ?? "Ces mesures sont des solutions de dernier recours en l'absence totale de secours professionnels. Elles ne remplacent pas un acte médical. Tout doit être fait pour obtenir une assistance médicale."}
          </div>
        </div>
      )}

      {/* Avertissement médical global */}
      <div style={{ backgroundColor: '#111', border: '1px solid #333', lineHeight: 1.6 }} className="rounded p-4">
        <div style={{ color: '#666', fontSize: '12px', marginBottom: '6px' }} className="uppercase tracking-wider font-mono">⚕️ Avertissement médical</div>
        <div style={{ color: '#777', fontSize: '13px' }}>
          {fiche.avertissement ?? "⚠️ Ce document est une aide-mémoire. Il ne remplace pas un avis ou un acte médical professionnel. En situation réelle, appelez les secours (15, 18, 112) dès que possible."}
        </div>
        <div style={{ color: '#555', fontSize: '12px', marginTop: '8px', borderTop: '1px solid #222', paddingTop: '8px' }}>
          Les informations présentées sont à titre indicatif uniquement. Elles ne remplacent pas une formation PSC1, AFGSU, NRBC ou tout autre dispositif de secourisme certifié. En cas de doute, consultez un professionnel de santé.
        </div>
      </div>

      {/* ── ZONE DE NOTES PERSONNELLES ──────────────────────────── */}
      <NotesZone ficheId={fiche.id} />
    </article>
  )
}

function NotesZone({ ficheId }) {
  const { text, save, savedAt } = useNotes(ficheId)
  const [open, setOpen] = useState(!!text)
  const timerRef = useRef(null)

  const handleChange = (val) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => save(val), 600)
  }

  return (
    <div style={{ backgroundColor: '#0d1a0d', border: '1px solid #1a3a1a' }} className="rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '14px 20px' }}
        className="flex items-center justify-between hover:bg-green-950/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span style={{ color: '#2ECC71', fontSize: '16px' }}>📝</span>
          <span style={{ fontFamily: 'Oswald, sans-serif', color: '#2ECC71', fontSize: '15px', letterSpacing: '1px' }}>
            NOTES PERSONNELLES
          </span>
          {text && <span style={{ color: '#2ECC71', fontSize: '11px', backgroundColor: '#0a2a0a', border: '1px solid #2ECC71', padding: '1px 6px' }} className="rounded-full">✓</span>}
        </div>
        <div className="flex items-center gap-3">
          {savedAt && open && (
            <span style={{ color: '#555', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace' }}>
              sauvegardé {savedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <span style={{ color: '#2ECC71', fontSize: '14px' }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <textarea
            defaultValue={text}
            onChange={e => handleChange(e.target.value)}
            placeholder="Ajoutez vos notes, observations, adaptations locales, contacts utiles, retours d'expérience..."
            style={{
              backgroundColor: '#060f06',
              borderColor: '#1a3a1a',
              color: '#c0d8c0',
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: '14px',
              lineHeight: 1.7,
              resize: 'vertical',
              minHeight: '140px',
              width: '100%',
              border: '1px solid #1a3a1a',
              borderRadius: '6px',
              padding: '12px',
              outline: 'none'
            }}
          />
          <div style={{ color: '#444', fontSize: '12px', marginTop: '6px' }}>
            Sauvegarde automatique — les notes sont stockées localement sur cet appareil
          </div>
        </div>
      )}
    </div>
  )
}

function InfoField({ label, value, mono, color }) {
  return (
    <div>
      <div style={{ color: '#9ca3af', fontSize: '11px' }} className="uppercase tracking-wider mb-1">{label}</div>
      <div style={{ color: color ?? '#f0f0f0', fontSize: '14px', fontFamily: mono ? 'IBM Plex Mono, monospace' : undefined }}>
        {value}
      </div>
    </div>
  )
}

function ZoneCard({ couleur, label, texte }) {
  return (
    <div style={{ backgroundColor: couleur + '22', borderTop: `3px solid ${couleur}` }} className="rounded p-3">
      <div style={{ color: couleur, fontFamily: 'Oswald, sans-serif', fontSize: '14px', letterSpacing: '1px' }} className="font-bold mb-2">
        {label}
      </div>
      <div style={{ color: '#d0d0d0', fontSize: '13px', lineHeight: 1.5 }}>{texte}</div>
    </div>
  )
}

function DiagCol({ icone, label, items }) {
  if (!items?.length) return null
  return (
    <div>
      <div style={{ color: '#F39C12', fontSize: '13px', fontFamily: 'Oswald, sans-serif' }} className="flex items-center gap-1 mb-2 uppercase tracking-wide">
        <span>{icone}</span> {label}
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} style={{ color: '#d0d0d0', fontSize: '14px' }} className="flex gap-2 items-start">
            <span style={{ color: '#F39C12', marginTop: '2px' }}>•</span>{item}
          </li>
        ))}
      </ul>
    </div>
  )
}
