import { useState, useRef } from 'react'
import NRBCBadge from './NRBCBadge'
import DiagramVisuel from './DiagramVisuel'
import SpeakButton from './SpeakButton'
import { getCategorieById, getSeverity } from '../data/categories'
import { useNotes } from '../hooks/useNotes'

// Couleurs hex (alignées sur les tokens) — passées à SpeakButton / accents JS
const C = {
  brand:   '#C8102E',
  accent:  '#0E7180',
  warning: '#B5740A',
  success: '#1E8A5A',
  ink:     '#1E2A37',
}

// ── Textes de lecture pour chaque section ────────────────────────────────────

function ttsActionsImmediates(fiche) {
  if (!fiche.actionsImmédiates?.length) return null
  return `Actions immédiates. ${fiche.actionsImmédiates.map((a, i) => `${i + 1}. ${a}`).join('. ')}.`
}

function ttsScriptAlerte(fiche) {
  if (!fiche.scriptAlerte) return null
  let t = `Script d'alerte. Appelez le ${fiche.scriptAlerte.numero}. ${fiche.scriptAlerte.quoiDire ?? ''}.`
  if (fiche.scriptAlerte.informationsAFournir?.length)
    t += ` Informations à communiquer: ${fiche.scriptAlerte.informationsAFournir.join('. ')}.`
  return t
}

function ttsSecurite(fiche) {
  if (!fiche.securiteAvantAction) return null
  let t = `Sécurité avant action. ${fiche.securiteAvantAction.regleUniverselle ?? ''}.`
  if (fiche.securiteAvantAction.risquesPourIntervenant?.length)
    t += ` Risques: ${fiche.securiteAvantAction.risquesPourIntervenant.join('. ')}.`
  if (fiche.securiteAvantAction.equipementsRequis?.length)
    t += ` Équipements requis: ${fiche.securiteAvantAction.equipementsRequis.join('. ')}.`
  return t
}

function ttsProcedure(fiche) {
  if (!fiche.procedureAction?.length) return null
  return `Procédure d'action. ${fiche.procedureAction.map(e => `Étape ${e.etape}: ${e.action}`).join('. ')}.`
}

function ttsDiagnostic(fiche) {
  if (!fiche.diagnosticRapide) return null
  let t = `Diagnostic rapide.`
  if (fiche.diagnosticRapide.visuels?.length)        t += ` Signes visuels: ${fiche.diagnosticRapide.visuels.join(', ')}.`
  if (fiche.diagnosticRapide.auditifs?.length)       t += ` Signes auditifs: ${fiche.diagnosticRapide.auditifs.join(', ')}.`
  if (fiche.diagnosticRapide.comportementaux?.length) t += ` Comportements: ${fiche.diagnosticRapide.comportementaux.join(', ')}.`
  return t
}

function ttsArbres(fiche) {
  if (!fiche.arbresDecision?.length) return null
  return `Arbre de décision. ${fiche.arbresDecision.map(a => `Si ${a.condition}, alors ${a.alors}`).join('. ')}.`
}

function ttsNotesCritiques(fiche) {
  if (!fiche.notesCritiques?.length) return null
  return `Notes critiques. ${fiche.notesCritiques.join('. ')}.`
}

function ttsPointsControle(fiche) {
  if (!fiche.pointsControle?.length) return null
  return `Points de contrôle. ${fiche.pointsControle.join('. ')}.`
}

function ttsEscalade(fiche) {
  if (!fiche.conditionsArretEscalade?.length) return null
  return `Conditions d'escalade. ${fiche.conditionsArretEscalade.join('. ')}.`
}

function ttsActivation(fiche) {
  if (!fiche.conditionsActivation) return null
  return `Conditions d'activation. ${fiche.conditionsActivation}`
}

function ttsSecoursTardent(fiche) {
  const s = fiche.siSecoursTardent
  if (!s) return null
  let t = `Si les secours tardent.`
  if (s.contexte) t += ` ${s.contexte}.`
  if (s.actions?.length) t += ` Actions possibles. ${s.actions.map((a, i) => `${i + 1}. ${a}`).join('. ')}.`
  if (s.ressourcesImprovises?.length) t += ` Ressources de fortune: ${s.ressourcesImprovises.join('. ')}.`
  if (s.signesAggravation?.length) t += ` Signes d'aggravation à surveiller: ${s.signesAggravation.join('. ')}.`
  if (s.limitesSansSecours) t += ` Limites sans prise en charge médicale: ${s.limitesSansSecours}.`
  return t
}

// ── Composants utilitaires ────────────────────────────────────────────────────

function Card({ children, style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '20px 22px', ...style }}
    >
      {children}
    </div>
  )
}

function SectionTitle({ children, color = 'var(--text)', speakText, speakColor, size = '15px' }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3.5">
      <h2 style={{ fontFamily: 'var(--font-display)', color, fontSize: size, fontWeight: 800, letterSpacing: '0.4px', margin: 0 }} className="uppercase">
        {children}
      </h2>
      {speakText && <SpeakButton text={speakText} color={speakColor} />}
    </div>
  )
}

// Section générique : carte blanche standard
function Section({ title, children, color, speakText, speakColor }) {
  return (
    <Card>
      <SectionTitle color={color} speakText={speakText} speakColor={speakColor ?? C.accent}>{title}</SectionTitle>
      {children}
    </Card>
  )
}

function MicroLabel({ children, color = 'var(--text-muted)' }) {
  return (
    <div style={{ color, fontSize: '10.5px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: '8px' }} className="uppercase">
      {children}
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function FicheDetail({ fiche }) {
  const categorie = getCategorieById(fiche.categorie)
  const sev = getSeverity(fiche.niveauDanger)
  const isNRBC = fiche.categorie === 'nrbc'
  const isChimique = fiche.categorie === 'chimique'
  const isDangerous = isNRBC || isChimique

  return (
    <article className="flex flex-col gap-4 pb-10">

      {/* Bandeau avertissement EPI */}
      {isDangerous && (
        <div
          className="bandeau-danger"
          style={{
            backgroundColor: 'var(--danger-bg)', color: 'var(--danger)',
            border: '1px solid var(--panel-action-border)',
            borderRadius: 'var(--radius-card-sm)', padding: '12px 18px', textAlign: 'center',
            fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px',
          }}
        >
          ⚠️ Intervention réservée aux personnels formés et équipés
        </div>
      )}

      {/* En-tête fiche */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
        <div style={{ height: '5px', background: categorie?.couleur ?? 'var(--fiche-accent-bar)' }} />
        <div style={{ padding: '22px 24px 24px' }}>
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '16px', color: categorie?.couleur }}>{categorie?.icone}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '1.5px' }} className="uppercase">
                {categorie?.label}
              </span>
            </div>
            <span
              style={{
                backgroundColor: sev.bg, color: sev.color, border: `1px solid ${sev.color}33`,
                fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.5px',
                padding: '4px 10px', borderRadius: '7px',
              }}
              className="uppercase font-medium flex items-center gap-1.5"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '999px', background: sev.color, display: 'inline-block' }} />
              {sev.label}
            </span>
          </div>

          <h1 className="titre-fiche" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.12, margin: 0 }}>
            {fiche.titre}
          </h1>

          <p style={{ color: 'var(--text-body)', fontSize: '16px', marginTop: '12px', lineHeight: 1.55 }}>
            {fiche.objectif}
          </p>

          {(fiche.tags?.length > 0 || (isNRBC && fiche.nrbc?.type)) && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {fiche.tags?.map(tag => (
                <span key={tag} style={{ backgroundColor: 'var(--chip-bg)', color: 'var(--chip-text)', fontFamily: 'var(--font-mono)', fontSize: '11.5px', padding: '3px 9px' }} className="rounded-full">
                  {tag}
                </span>
              ))}
              {isNRBC && fiche.nrbc?.type && <NRBCBadge type={fiche.nrbc.type} niveauEPI={fiche.nrbc.niveauEPI} />}
            </div>
          )}
        </div>
      </div>

      {/* Conditions d'activation */}
      {fiche.conditionsActivation && (
        <Section title="🎯 Conditions d'activation" color="var(--warning)" speakText={ttsActivation(fiche)} speakColor={C.warning}>
          <p style={{ color: 'var(--text-body)', fontSize: '15px', lineHeight: 1.6 }}>{fiche.conditionsActivation}</p>
        </Section>
      )}

      {/* Infos NRBC */}
      {isNRBC && fiche.nrbc && (
        <Card style={{ background: 'var(--panel-warn-soft)', borderColor: 'var(--panel-warn-border)' }}>
          <SectionTitle color="var(--warning)">☢️ Informations NRBC</SectionTitle>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {fiche.nrbc.agent && <InfoField label="Agent" value={fiche.nrbc.agent} />}
            {fiche.nrbc.codeNU && <InfoField label="Code NU" value={fiche.nrbc.codeNU} mono />}
            {fiche.nrbc.classificationADR && <InfoField label="Classif. ADR" value={fiche.nrbc.classificationADR} />}
            {fiche.nrbc.zoneExclusion && <InfoField label="Zone exclusion" value={fiche.nrbc.zoneExclusion} color="var(--danger)" />}
            {fiche.nrbc.niveauEPI && <InfoField label="EPI requis" value={fiche.nrbc.niveauEPI.split('—')[0].trim()} color="var(--warning)" />}
            {fiche.nrbc.decontaminationRequise !== undefined && (
              <InfoField label="Décontam." value={fiche.nrbc.decontaminationRequise ? 'OBLIGATOIRE' : 'Non requise'} color={fiche.nrbc.decontaminationRequise ? 'var(--danger)' : 'var(--success)'} />
            )}
          </div>
        </Card>
      )}

      {/* Infos chimique */}
      {(isChimique || (isNRBC && fiche.chimique)) && fiche.chimique && (
        <Card style={{ background: 'var(--surface-subtle)', borderColor: 'var(--border)' }}>
          <SectionTitle color="var(--cat-chimique)">☣️ Données chimiques</SectionTitle>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {fiche.chimique.produit && <InfoField label="Produit" value={fiche.chimique.produit} />}
            {fiche.chimique.seuilOlfactif && <InfoField label="Seuil olfactif" value={fiche.chimique.seuilOlfactif} mono />}
            {fiche.chimique.seuilDanger && <InfoField label="Seuil danger" value={fiche.chimique.seuilDanger} mono color="var(--warning)" />}
            {fiche.chimique.seuilLCLO && <InfoField label="Seuil LCLO" value={fiche.chimique.seuilLCLO} mono color="var(--danger)" />}
            {fiche.chimique.epiMinimum && <InfoField label="EPI minimum" value={fiche.chimique.epiMinimum} color="var(--warning)" />}
          </div>
          {fiche.chimique.symptomesIntoxication?.length > 0 && (
            <div className="mt-4">
              <MicroLabel>Symptômes</MicroLabel>
              <div className="flex flex-wrap gap-2">
                {fiche.chimique.symptomesIntoxication.map((s, i) => (
                  <span key={i} style={{ backgroundColor: 'var(--chip-bg)', color: 'var(--cat-chimique)', fontSize: '12.5px' }} className="px-2.5 py-1 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Zones d'intervention */}
      {(isNRBC || isChimique) && fiche.zonesIntervention && (
        <Section title="🗺️ Zones d'intervention">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ZoneCard couleur="var(--danger)" label="Zone rouge" texte={fiche.zonesIntervention.zoneRouge} />
            <ZoneCard couleur="var(--warning)" label="Zone orange" texte={fiche.zonesIntervention.zoneOrange} />
            <ZoneCard couleur="var(--success)" label="Zone verte" texte={fiche.zonesIntervention.zoneVerte} />
          </div>
        </Section>
      )}

      {/* Diagnostic rapide */}
      {fiche.diagnosticRapide && (
        <Section title="🔍 Diagnostic rapide" color="var(--warning)" speakText={ttsDiagnostic(fiche)} speakColor={C.warning}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <DiagCol icone="👁" label="Visuels" items={fiche.diagnosticRapide.visuels} />
            <DiagCol icone="👂" label="Auditifs" items={fiche.diagnosticRapide.auditifs} />
            <DiagCol icone="🧠" label="Comportements" items={fiche.diagnosticRapide.comportementaux} />
          </div>
        </Section>
      )}

      {/* Sécurité avant action */}
      {fiche.securiteAvantAction && (
        <Card style={{ background: 'var(--panel-warn-bg)', borderColor: 'var(--panel-warn-border)' }}>
          <SectionTitle color="var(--warning)" speakText={ttsSecurite(fiche)} speakColor={C.warning}>⚠️ Sécurité avant action</SectionTitle>
          <div style={{ background: 'var(--panel-warn-soft)', borderLeft: '3px solid var(--warning)', borderRadius: 'var(--radius-inner)', color: 'var(--text)', fontSize: '15px', lineHeight: 1.55 }} className="p-4 mb-4 font-medium">
            {fiche.securiteAvantAction.regleUniverselle}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fiche.securiteAvantAction.risquesPourIntervenant?.length > 0 && (
              <div>
                <MicroLabel color="var(--warning)">Risques intervenant</MicroLabel>
                <ul className="flex flex-col gap-1.5">
                  {fiche.securiteAvantAction.risquesPourIntervenant.map((r, i) => (
                    <li key={i} style={{ color: 'var(--text-body)', fontSize: '14px', lineHeight: 1.5 }} className="flex gap-2">
                      <span style={{ color: 'var(--warning)' }}>▸</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {fiche.securiteAvantAction.equipementsRequis?.length > 0 && (
              <div>
                <MicroLabel color="var(--success)">Équipements requis</MicroLabel>
                <ul className="flex flex-col gap-1.5">
                  {fiche.securiteAvantAction.equipementsRequis.map((e, i) => (
                    <li key={i} style={{ color: 'var(--text-body)', fontSize: '14px', lineHeight: 1.5 }} className="flex gap-2">
                      <span style={{ color: 'var(--success)' }}>✓</span>{e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Script d'alerte */}
      {fiche.scriptAlerte && (
        <Card>
          <SectionTitle color="var(--brand)" speakText={ttsScriptAlerte(fiche)} speakColor={C.brand}>📞 Script d'alerte</SectionTitle>
          <div style={{ background: 'var(--ink)', borderRadius: 'var(--radius-control)', padding: '14px 18px', marginBottom: '14px' }}>
            <div style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 600, letterSpacing: '1px' }}>
              {fiche.scriptAlerte.numero}
            </div>
          </div>
          <div style={{ background: 'var(--surface-subtle)', borderLeft: '3px solid var(--ink)', borderRadius: 'var(--radius-inner)', fontFamily: 'var(--font-mono)', fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.8 }} className="p-4">
            {fiche.scriptAlerte.quoiDire}
          </div>
          {fiche.scriptAlerte.informationsAFournir?.length > 0 && (
            <div className="mt-4">
              <MicroLabel>Informations à fournir</MicroLabel>
              <ul className="flex flex-col gap-1.5">
                {fiche.scriptAlerte.informationsAFournir.map((info, i) => (
                  <li key={i} style={{ color: 'var(--text-body)', fontSize: '14px', lineHeight: 1.5 }} className="flex gap-2">
                    <span style={{ color: 'var(--accent)' }}>→</span>{info}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Actions immédiates */}
      {fiche.actionsImmédiates && (
        <Card style={{ background: 'var(--panel-action-bg)', borderColor: 'var(--panel-action-border)' }}>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <span style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12z" /></svg>
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand)', fontSize: '16px', fontWeight: 800, letterSpacing: '0.4px', margin: 0 }} className="uppercase">
                Actions immédiates
              </h2>
              <span style={{ background: 'var(--brand)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '10.5px', padding: '3px 8px', borderRadius: '999px', letterSpacing: '0.5px' }}>
                ≤ 3 MIN
              </span>
            </div>
            <SpeakButton text={ttsActionsImmediates(fiche)} color={C.brand} />
          </div>
          <ol className="flex flex-col gap-3">
            {fiche.actionsImmédiates.map((action, i) => (
              <li key={i} className="flex gap-3 items-center">
                <span style={{ width: '30px', height: '30px', minWidth: '30px', borderRadius: '999px', background: 'var(--brand)', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700 }} className="flex items-center justify-center">
                  {i + 1}
                </span>
                <span style={{ color: 'var(--text)', fontSize: '16px', fontWeight: 600, lineHeight: 1.4 }}>{action}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Procédure d'action */}
      {fiche.procedureAction && (
        <Section title="📋 Procédure d'action" speakText={ttsProcedure(fiche)} speakColor={C.accent}>
          <div className="flex flex-col gap-3">
            {fiche.procedureAction.map((e) => (
              <div key={e.etape} className="flex gap-3 items-start">
                <span style={{ width: '27px', height: '27px', minWidth: '27px', borderRadius: '8px', background: 'var(--ink)', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, marginTop: '1px' }} className="flex items-center justify-center">
                  {e.etape}
                </span>
                <div style={{ color: 'var(--text-body)', fontSize: '15px', lineHeight: 1.55 }}>{e.action}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Décontamination */}
      {fiche.decontamination?.requise && (
        <Card style={{ background: 'var(--surface-subtle)' }}>
          <SectionTitle color="var(--cat-chimique)">🧪 Décontamination</SectionTitle>
          <div style={{ color: 'var(--text-body)', fontSize: '15px', lineHeight: 1.65 }}>
            {fiche.decontamination.protocole}
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fiche.decontamination.pointDecontamination && <InfoField label="Point décontam." value={fiche.decontamination.pointDecontamination} />}
            {fiche.decontamination.gestionVetements && <InfoField label="Gestion vêtements" value={fiche.decontamination.gestionVetements} />}
          </div>
        </Card>
      )}

      {/* Arbre de décision */}
      {fiche.arbresDecision?.length > 0 && (
        <Section title="🌿 Arbre de décision" color="var(--warning)" speakText={ttsArbres(fiche)} speakColor={C.warning}>
          <DiagramVisuel arbresDecision={fiche.arbresDecision} />
        </Section>
      )}

      {/* Notes critiques */}
      {fiche.notesCritiques?.length > 0 && (
        <Card style={{ background: 'var(--panel-action-bg)', borderColor: 'var(--panel-action-border)' }}>
          <SectionTitle color="var(--brand)" speakText={ttsNotesCritiques(fiche)} speakColor={C.brand}>🔴 Notes critiques</SectionTitle>
          <ul className="flex flex-col gap-2.5">
            {fiche.notesCritiques.map((note, i) => (
              <li key={i} style={{ color: 'var(--text-body)', fontSize: '15px', lineHeight: 1.5 }} className="flex gap-2.5">
                <span style={{ color: 'var(--brand)', fontWeight: 800, flexShrink: 0 }}>!</span>{note}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Points de contrôle */}
      {fiche.pointsControle?.length > 0 && (
        <Section title="✅ Points de contrôle" color="var(--success)" speakText={ttsPointsControle(fiche)} speakColor={C.success}>
          <ul className="flex flex-col gap-2.5">
            {fiche.pointsControle.map((pt, i) => (
              <li key={i} style={{ color: 'var(--text-body)', fontSize: '15px', lineHeight: 1.5 }} className="flex gap-2.5 items-start">
                <span style={{ width: '20px', height: '20px', minWidth: '20px', borderRadius: '5px', border: '1.5px solid var(--success)', color: 'var(--success)', marginTop: '1px' }} className="flex items-center justify-center text-xs">✓</span>
                {pt}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Conditions d'arrêt / escalade */}
      {fiche.conditionsArretEscalade?.length > 0 && (
        <Section title="⬆️ Escalade" color="var(--warning)" speakText={ttsEscalade(fiche)} speakColor={C.warning}>
          <ul className="flex flex-col gap-2.5">
            {fiche.conditionsArretEscalade.map((c, i) => (
              <li key={i} style={{ color: 'var(--text-body)', fontSize: '15px', lineHeight: 1.5 }} className="flex gap-2.5">
                <span style={{ color: 'var(--warning)' }}>▲</span>{c}
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
              <span key={i} style={{ backgroundColor: 'var(--chip-bg)', color: 'var(--text-body)', fontSize: '13px', border: '1px solid var(--border)' }} className="px-3 py-1.5 rounded-md">
                {r}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Si les secours tardent */}
      {fiche.siSecoursTardent && (
        <Card style={{ background: 'var(--panel-warn-bg)', borderColor: 'var(--panel-warn-border)' }}>
          <SectionTitle color="var(--warning)" size="16px" speakText={ttsSecoursTardent(fiche)} speakColor={C.warning}>🕐 Si les secours tardent</SectionTitle>

          {fiche.siSecoursTardent.contexte && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', fontStyle: 'italic', lineHeight: 1.55 }}>
              {fiche.siSecoursTardent.contexte}
            </p>
          )}

          {fiche.siSecoursTardent.actions?.length > 0 && (
            <div className="mb-4">
              <MicroLabel color="var(--warning)">Actions possibles</MicroLabel>
              <ul className="flex flex-col gap-2">
                {fiche.siSecoursTardent.actions.map((a, i) => (
                  <li key={i} style={{ color: 'var(--text-body)', fontSize: '14px', lineHeight: 1.6 }} className="flex gap-2.5 items-start">
                    <span style={{ color: 'var(--warning)', fontFamily: 'var(--font-display)', fontWeight: 700, minWidth: '18px' }}>{i + 1}.</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fiche.siSecoursTardent.ressourcesImprovises?.length > 0 && (
              <div>
                <MicroLabel>🧰 Ressources de fortune</MicroLabel>
                <ul className="flex flex-col gap-1.5">
                  {fiche.siSecoursTardent.ressourcesImprovises.map((r, i) => (
                    <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }} className="flex gap-2">
                      <span style={{ color: 'var(--warning)' }}>→</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {fiche.siSecoursTardent.signesAggravation?.length > 0 && (
              <div>
                <MicroLabel color="var(--danger)">▲ Signes d'aggravation</MicroLabel>
                <ul className="flex flex-col gap-1.5">
                  {fiche.siSecoursTardent.signesAggravation.map((s, i) => (
                    <li key={i} style={{ color: 'var(--text-body)', fontSize: '13px', lineHeight: 1.5 }} className="flex gap-2">
                      <span style={{ color: 'var(--danger)' }}>▲</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {fiche.siSecoursTardent.limitesSansSecours && (
            <div style={{ background: 'var(--panel-warn-soft)', borderLeft: '3px solid var(--warning)', borderRadius: 'var(--radius-inner)', marginTop: '16px' }} className="p-3.5">
              <MicroLabel>Limites sans prise en charge médicale</MicroLabel>
              <div style={{ color: 'var(--text-body)', fontSize: '14px', lineHeight: 1.6 }}>
                {fiche.siSecoursTardent.limitesSansSecours}
              </div>
            </div>
          )}

          <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.6, marginTop: '14px' }} className="rounded-lg p-3">
            ⚠️ {fiche.siSecoursTardent.avertissement ?? "Ces mesures sont des solutions de dernier recours en l'absence totale de secours professionnels. Elles ne remplacent pas un acte médical. Tout doit être fait pour obtenir une assistance médicale."}
          </div>
        </Card>
      )}

      {/* Avertissement médical */}
      <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card-sm)', lineHeight: 1.6 }} className="p-4">
        <MicroLabel>⚕️ Avertissement médical</MicroLabel>
        <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          {fiche.avertissement ?? "⚠️ Ce document est une aide-mémoire. Il ne remplace pas un avis ou un acte médical professionnel. En situation réelle, appelez les secours (15, 18, 112) dès que possible."}
        </div>
        <div style={{ color: 'var(--text-faint)', fontSize: '12px', marginTop: '8px', borderTop: '1px solid var(--divider)', paddingTop: '8px' }}>
          Les informations présentées sont à titre indicatif uniquement. Elles ne remplacent pas une formation PSC1, AFGSU, NRBC ou tout autre dispositif de secourisme certifié. En cas de doute, consultez un professionnel de santé.
        </div>
      </div>

      {/* Notes personnelles */}
      <NotesZone ficheId={fiche.id} />
    </article>
  )
}

// ── Sous-composants ───────────────────────────────────────────────────────────

function NotesZone({ ficheId }) {
  const { text, save, savedAt } = useNotes(ficheId)
  const [open, setOpen] = useState(!!text)
  const timerRef = useRef(null)

  const handleChange = (val) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => save(val), 600)
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)' }} className="overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '16px 20px' }}
        className="flex items-center justify-between hover:bg-[var(--surface-subtle)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--accent)', fontSize: '15px' }}>📝</span>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '15px', fontWeight: 700, letterSpacing: '0.3px' }} className="uppercase">
            Notes personnelles
          </span>
          {text && <span style={{ color: 'var(--success)', fontSize: '11px', backgroundColor: 'var(--success-bg)', border: '1px solid var(--success)', padding: '1px 7px' }} className="rounded-full">✓</span>}
        </div>
        <div className="flex items-center gap-3">
          {savedAt && open && (
            <span style={{ color: 'var(--text-faint)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              sauvegardé {savedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <textarea
            defaultValue={text}
            onChange={e => handleChange(e.target.value)}
            placeholder="Ajoutez vos notes, observations, adaptations locales, contacts utiles, retours d'expérience..."
            style={{
              backgroundColor: 'var(--surface-input)',
              color: 'var(--text)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              lineHeight: 1.7,
              resize: 'vertical',
              minHeight: '140px',
              width: '100%',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-control)',
              padding: '12px',
              outline: 'none',
            }}
          />
          <div style={{ color: 'var(--text-faint)', fontSize: '12px', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            Sauvegarde automatique — stockage local sur cet appareil
          </div>
        </div>
      )}
    </div>
  )
}

function InfoField({ label, value, mono, color }) {
  return (
    <div>
      <MicroLabel>{label}</MicroLabel>
      <div style={{ color: color ?? 'var(--text)', fontSize: '14px', fontFamily: mono ? 'var(--font-mono)' : undefined, fontWeight: 500 }}>
        {value}
      </div>
    </div>
  )
}

function ZoneCard({ couleur, label, texte }) {
  return (
    <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderTop: `3px solid ${couleur}`, borderRadius: 'var(--radius-inner)' }} className="p-3.5">
      <div style={{ color: couleur, fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px' }} className="uppercase mb-2">
        {label}
      </div>
      <div style={{ color: 'var(--text-body)', fontSize: '13px', lineHeight: 1.5 }}>{texte}</div>
    </div>
  )
}

function DiagCol({ icone, label, items }) {
  if (!items?.length) return null
  return (
    <div>
      <div style={{ color: 'var(--warning)', fontSize: '12.5px', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.5px' }} className="flex items-center gap-1.5 mb-2.5 uppercase">
        <span>{icone}</span> {label}
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} style={{ color: 'var(--text-body)', fontSize: '14px', lineHeight: 1.5 }} className="flex gap-2 items-start">
            <span style={{ color: 'var(--warning)', marginTop: '2px' }}>•</span>{item}
          </li>
        ))}
      </ul>
    </div>
  )
}
