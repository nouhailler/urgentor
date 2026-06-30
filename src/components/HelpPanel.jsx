import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ── Contenu d'aide par route ──────────────────────────────────────────────────

const HELP = {

  '/': {
    titre: 'Bibliothèque de fiches',
    intro: 'Page principale — accès rapide à toutes les fiches de premiers secours.',
    sections: [
      {
        icone: '🔍', couleur: '#CC0000',
        titre: 'Recherche intelligente',
        texte: 'Tapez sans accents : "brulure", "hemo", "gaz"… Les suggestions apparaissent dès 2 caractères. Tapez directement sur une suggestion pour ouvrir la fiche sans étape supplémentaire.',
      },
      {
        icone: '🏷️', couleur: '#F39C12',
        titre: 'Filtres par catégorie',
        texte: 'Les boutons colorés (🩺 🔥 ☣️ ☢️…) filtrent les fiches par type de risque. Appuyez à nouveau sur un filtre actif pour l\'enlever.',
      },
      {
        icone: '📄', couleur: '#3498DB',
        titre: 'Fiches',
        texte: 'Chaque carte affiche le niveau de danger, la catégorie et le titre. Un point de couleur indique le niveau de risque (vert = standard, orange = élevé, rouge = critique).',
      },
      {
        icone: '📴', couleur: '#2ECC71',
        titre: 'Mode hors ligne',
        texte: 'L\'application fonctionne sans connexion internet une fois chargée. Installez-la sur l\'écran d\'accueil (option "Ajouter à l\'écran d\'accueil") pour y accéder en un tap.',
      },
      {
        icone: '+', couleur: '#CC0000',
        titre: 'Nouvelle fiche (bouton rouge en bas à droite)',
        texte: 'Créez une fiche personnalisée manuellement ou laissez l\'IA la générer à partir d\'un titre et d\'une catégorie. Nécessite une clé API dans les Paramètres.',
      },
    ]
  },

  '/fiche': {
    titre: 'Fiche de premiers secours',
    intro: 'Chaque section a un rôle précis. Lisez-les dans l\'ordre ou utilisez la lecture vocale si vos mains sont occupées.',
    sections: [
      {
        icone: '🔊', couleur: '#2ECC71',
        titre: 'Boutons lecture vocale',
        texte: 'Chaque titre de section dispose d\'un bouton haut-parleur. Appuyez une fois → lecture immédiate à voix haute. Appuyez à nouveau → arrêt. Changer de section arrête automatiquement la précédente. Idéal quand vos deux mains sont occupées à aider.',
      },
      {
        icone: '⚡', couleur: '#CC0000',
        titre: 'Actions immédiates — 3 min max',
        texte: 'Les 3 à 4 gestes prioritaires à faire dans les premières minutes, AVANT même d\'appeler les secours si vous êtes seul. Court et vital.',
      },
      {
        icone: '📞', couleur: '#CC0000',
        titre: 'Script d\'alerte',
        texte: 'Le numéro exact à appeler (15, 18 ou 112) et mot pour mot ce qu\'il faut dire à l\'opérateur. Lisez-le tel quel — cela accélère la prise en charge.',
      },
      {
        icone: '⚠️', couleur: '#FF6B35',
        titre: 'Sécurité avant action',
        texte: 'Ce que VOUS risquez avant d\'intervenir. Ne jamais ignorer ces avertissements — un secouriste blessé aggrave la situation. La règle universelle s\'applique systématiquement.',
      },
      {
        icone: '📋', couleur: '#9ca3af',
        titre: 'Procédure d\'action',
        texte: 'Les étapes dans l\'ordre. Suivez-les une par une sans en sauter. Chaque étape suppose que la précédente est faite.',
      },
      {
        icone: '🌿', couleur: '#F39C12',
        titre: 'Arbre de décision',
        texte: '"Si [vous observez ceci] → alors [faites cela]". Adapte la procédure à ce que vous voyez réellement. Consultez-le si la situation évolue.',
      },
      {
        icone: '🕐', couleur: '#F39C12',
        titre: 'Si les secours tardent',
        texte: 'Que faire si les secours mettent plus de 20 à 30 minutes. Ces mesures sont des solutions de dernier recours — elles ne remplacent pas une prise en charge médicale mais permettent de maintenir la victime en vie le plus longtemps possible.',
      },
      {
        icone: '🔴', couleur: '#FF6B35',
        titre: 'Notes critiques',
        texte: 'Ce qu\'il ne faut JAMAIS faire dans cette situation. Une erreur peut aggraver l\'état de la victime. Lisez toujours cette section.',
      },
      {
        icone: '📝', couleur: '#2ECC71',
        titre: 'Notes personnelles',
        texte: 'Zone libre pour vos observations, contacts locaux utiles (médecin du coin, hélico, etc.), adaptations terrain ou retours d\'expérience. Sauvegardées uniquement sur cet appareil.',
      },
    ]
  },

  '/parametres': {
    titre: 'Paramètres',
    intro: 'Configuration de l\'import de fiches et des fournisseurs d\'IA pour la création automatique.',
    sections: [
      {
        icone: '📥', couleur: '#2ECC71',
        titre: 'Importer des fiches',
        texte: 'Permet de charger sur votre téléphone des fiches préparées sur un ordinateur. Sur desktop : créez/modifiez vos fiches dans "Gérer les fiches" puis exportez-les en .json. Sur mobile : ouvrez Paramètres → touchez la zone verte → sélectionnez le fichier.',
        items: [
          'Format accepté : fichier .json (tableau [...] ou fiche unique {...})',
          'Chaque fiche doit avoir les champs id et titre',
          'Les fiches déjà présentes (même id) sont ignorées — pas de doublon',
        ]
      },
      {
        icone: '🤖', couleur: '#6366F1',
        titre: 'Génération de fiches par IA',
        texte: 'En configurant une clé API, vous pouvez créer automatiquement une fiche complète en tapant simplement un titre et une catégorie. L\'IA génère toutes les sections : actions immédiates, procédure, arbres de décision, "si les secours tardent", etc.',
      },
      {
        icone: '🟣', couleur: '#9B59B6',
        titre: 'Anthropic Claude',
        texte: 'Meilleure qualité de génération. Fiches très détaillées et précises. Recommandé si vous voulez des fiches de haute qualité pour des situations complexes (NRBC, chimique).',
      },
      {
        icone: '🟢', couleur: '#2ECC71',
        titre: 'OpenAI GPT',
        texte: 'Bonne qualité générale. Large fenêtre de contexte, idéal pour les fiches longues.',
      },
      {
        icone: '🔵', couleur: '#3498DB',
        titre: 'OpenRouter — modèles gratuits',
        texte: 'Donne accès à de nombreux modèles gratuits (:free). Cliquez "Actualiser" pour charger la liste à jour, puis sélectionnez un modèle. Qualité variable selon le modèle choisi.',
      },
      {
        icone: '🔒', couleur: '#555',
        titre: 'Sécurité des clés',
        texte: 'Vos clés API sont stockées uniquement dans le navigateur de votre appareil (localStorage). Elles ne transitent jamais par un serveur tiers — chaque appel IA est direct depuis votre appareil vers le fournisseur.',
      },
    ]
  },

  '/nouvelle-fiche': {
    titre: 'Créer une fiche',
    intro: 'Deux modes : génération automatique par IA (recommandé) ou saisie manuelle champ par champ.',
    sections: [
      {
        icone: '🤖', couleur: '#6366F1',
        titre: 'Mode IA (recommandé)',
        texte: 'Entrez un titre précis + sélectionnez la catégorie → l\'IA génère automatiquement toutes les sections en quelques secondes. Prévisualisez le résultat avant d\'accepter. Nécessite une clé API dans Paramètres.',
        items: [
          'Soyez précis dans le titre : "Brûlure chimique acide" plutôt que "Brûlure"',
          'Précisez le produit pour les fiches chimiques/NRBC',
          'Vous pouvez modifier la fiche générée depuis "Gérer les fiches"',
        ]
      },
      {
        icone: '✏️', couleur: '#F39C12',
        titre: 'Saisie manuelle — chaque champ compte',
        texte: 'Une fiche incomplète ou imprécise peut induire en erreur en situation réelle. Prenez le temps de remplir tous les champs avec soin.',
        items: [
          'Titre : précis et distinctif — évitez les titres trop génériques',
          'Objectif : ce qu\'on cherche à éviter (ex: choc hémorragique, asphyxie)',
          'Actions immédiates : 3-4 gestes MAX, dans l\'ordre de priorité vitale',
          'Étapes : une action par étape, verbe d\'action + objet (ex: "Allonger la victime")',
          'Tags : incluez les synonymes (ex: crise, convulsion, épilepsie pour une même fiche)',
          'Conditions d\'activation : décrivez précisément quand utiliser cette fiche',
        ]
      },
      {
        icone: '⚠️', couleur: '#FF6B35',
        titre: 'Fiches officielles vs personnalisées',
        texte: 'Les 10 fiches officielles ne sont pas modifiables directement (elles sont basées sur des référentiels HAS/INRS). Pour les adapter, utilisez "Créer une copie modifiable" depuis la page de la fiche. Vos fiches personnalisées sont éditables librement.',
      },
    ]
  },

  '/gestion': {
    titre: 'Gestion des fiches',
    intro: 'Consultez, modifiez, exportez et importez toutes vos fiches depuis cette page.',
    sections: [
      {
        icone: '👁', couleur: '#9ca3af',
        titre: 'Voir',
        texte: 'Ouvre la fiche en mode lecture. Disponible pour toutes les fiches.',
      },
      {
        icone: '✏️', couleur: '#6366F1',
        titre: 'Modifier (fiches personnalisées uniquement)',
        texte: 'Ouvre l\'éditeur JSON intégré. Le JSON est validé en temps réel — un indicateur rouge/vert vous signale les erreurs. Les fiches officielles ne sont pas modifiables directement mais peuvent être copiées.',
      },
      {
        icone: '⬇️', couleur: '#2ECC71',
        titre: 'Exporter',
        texte: 'Télécharge la fiche (ou toutes les fiches personnalisées) en fichier .json. Envoyez ce fichier par mail ou cloud pour l\'importer sur un autre appareil via Paramètres → Import.',
      },
      {
        icone: '🗑', couleur: '#CC0000',
        titre: 'Supprimer (fiches personnalisées uniquement)',
        texte: 'Suppression définitive après confirmation. Les fiches officielles ne peuvent pas être supprimées.',
      },
      {
        icone: '🏷️', couleur: '#F39C12',
        titre: 'Badges de source',
        texte: '🏛️ Officielle — basée sur référentiels HAS/INRS. 🤖 IA — générée par intelligence artificielle. ✏️ Manuel — créée manuellement. 📝 indique qu\'une note personnelle existe sur cette fiche.',
      },
    ]
  },

}

function getHelpForPath(pathname) {
  if (pathname === '/') return HELP['/']
  if (pathname.startsWith('/fiche/')) return HELP['/fiche']
  if (pathname === '/parametres') return HELP['/parametres']
  if (pathname === '/nouvelle-fiche') return HELP['/nouvelle-fiche']
  if (pathname === '/gestion') return HELP['/gestion']
  return null
}

// ── Composant panneau ─────────────────────────────────────────────────────────

export default function HelpPanel({ open, onClose }) {
  const location = useLocation()
  const help = getHelpForPath(location.pathname)

  // Fermer avec la touche Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Bloquer le scroll du body quand ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!help) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(2px)',
          zIndex: 90,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Panneau */}
      <div
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: 'min(420px, 100vw)',
          backgroundColor: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-12px 0 32px rgba(20,32,43,0.10)',
          zIndex: 100,
          overflowY: 'auto',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* En-tête */}
        <div style={{
          position: 'sticky', top: 0,
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 20px',
          paddingTop: 'calc(16px + env(safe-area-inset-top))',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
          zIndex: 1,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                backgroundColor: 'var(--accent-soft)', color: 'var(--accent-deep)',
                fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.5px',
                padding: '3px 8px', borderRadius: '6px',
              }}>AIDE</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.2px' }}>
              {help.titre}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
              {help.intro}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid var(--border-strong)', cursor: 'pointer',
              color: 'var(--text-muted)', padding: '6px', borderRadius: '8px', flexShrink: 0,
              marginTop: '2px',
            }}
            className="hover:border-[var(--border-hover)] hover:text-[var(--text)] transition-colors"
            aria-label="Fermer l'aide"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {help.sections.map((s, i) => (
            <div key={i} style={{
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border)',
              borderLeft: `3px solid ${s.couleur}`,
              borderRadius: '0 10px 10px 0',
              padding: '14px 16px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px',
              }}>
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{s.icone}</span>
                <span style={{
                  fontFamily: 'var(--font-display)', color: s.couleur, fontWeight: 700,
                  fontSize: '14px', letterSpacing: '0.2px',
                }}>
                  {s.titre}
                </span>
              </div>
              <p style={{ color: 'var(--text-body)', fontSize: '13px', lineHeight: 1.65, margin: 0 }}>
                {s.texte}
              </p>
              {s.items && (
                <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {s.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>
                      <span style={{ color: s.couleur, flexShrink: 0, marginTop: '2px' }}>▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Pied */}
        <div style={{ padding: '16px 20px', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--text-faint)', fontSize: '12px', textAlign: 'center', lineHeight: 1.6 }}>
            Urgentor — Fiches de premiers secours<br/>
            <span style={{ color: 'var(--text-muted)' }}>En cas d'urgence réelle : 15 · 18 · 112</span>
          </div>
        </div>
      </div>
    </>
  )
}
