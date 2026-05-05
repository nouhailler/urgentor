# CONTEXT — Urgentor

Document de référence du projet. À mettre à jour à chaque évolution significative.

---

## Vue d'ensemble

**Urgentor** est une PWA React de fiches opérationnelles de premiers secours, conçue pour être utilisée sur smartphone sans connexion internet, dans des situations d'urgence réelles.

- Dépôt GitHub : `https://github.com/nouhailler/urgentor`
- Déployé sur Netlify (SPA + PWA, hors ligne)
- Langue : français

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework UI | React 19 + Vite 8 |
| Routing | React Router v7 |
| CSS | Tailwind CSS v4 (`@tailwindcss/vite`) |
| PWA | `vite-plugin-pwa` v1.2 — Workbox generateSW |
| Polices | Google Fonts : Oswald (titres), IBM Plex Sans (corps), IBM Plex Mono (mono) |
| TTS | Web Speech API (`speechSynthesis`) |
| Persistance | `localStorage` uniquement (pas de backend) |
| Déploiement | Netlify (`netlify.toml` + `public/_redirects`) |

**Note npm** : `.npmrc` contient `legacy-peer-deps=true` pour contourner l'incompatibilité de peer deps de `vite-plugin-pwa` avec Vite 8.

---

## Architecture des fichiers

```
src/
├── App.jsx                        # Router principal, toutes les routes
├── index.css                      # Variables globales, animations (speak-wave), mobile overrides
├── main.jsx
│
├── components/
│   ├── Navbar.jsx                 # Barre de navigation sticky, bouton ?, roue paramètres
│   ├── HelpPanel.jsx              # Panneau d'aide contextuel (slide-in depuis la droite)
│   ├── SearchBar.jsx              # Barre de recherche accent-insensible + autocomplete
│   ├── FicheCard.jsx              # Carte de fiche dans la grille
│   ├── FicheDetail.jsx            # Affichage complet d'une fiche avec TTS par section
│   ├── SpeakButton.jsx            # Bouton haut-parleur animé (Web Speech API)
│   ├── AIGenerator.jsx            # Générateur de fiche par IA (Anthropic / OpenAI / OpenRouter)
│   ├── DiagramVisuel.jsx          # Diagramme corporel visuel optionnel
│   └── NRBCBadge.jsx              # Badge spécial pour les fiches NRBC
│
├── pages/
│   ├── Home.jsx                   # Bibliothèque : recherche + filtres catégories + grille
│   ├── FichePage.jsx              # Page d'une fiche (charge FicheDetail)
│   ├── NewFiche.jsx               # Création manuelle ou via IA
│   ├── EditFiche.jsx              # Édition d'une fiche existante
│   ├── GestionFiches.jsx          # Liste + export + suppression des fiches personnalisées
│   └── Settings.jsx               # Paramètres IA + import de fiches JSON
│
├── hooks/
│   ├── useFiches.js               # État global des fiches (builtin + custom), CRUD, import/export
│   ├── useSpeech.js               # Hook TTS : voix FR, Android async, iOS keepalive
│   ├── useSettings.js             # Clés API et modèles IA (localStorage)
│   ├── useNotes.js                # Notes personnelles par fiche
│   └── useOpenRouterModels.js     # Chargement dynamique des modèles OpenRouter
│
└── data/
    ├── categories.js              # Tableau CATEGORIES + getCategorieById + DANGER_COLORS
    ├── ficheIndex.js              # Import statique de toutes les fiches JSON, exports utilitaires
    └── fiches/
        ├── secours-personne/      # malaise, hemorragie, brulure, noyade
        ├── incendie-evacuation/   # incendie, evacuation
        ├── chimique/              # fuite-gaz, deversement-chimique
        └── nrbc/                  # alerte-radiologique, alerte-chimique-nrbc
```

---

## Routes

| Path | Composant | Description |
|---|---|---|
| `/` | `Home` | Bibliothèque + recherche + filtres |
| `/fiche/:id` | `FichePage` | Détail d'une fiche |
| `/nouvelle-fiche` | `NewFiche` | Création manuelle ou IA |
| `/modifier-fiche/:id` | `EditFiche` | Édition d'une fiche custom |
| `/gestion` | `GestionFiches` | Gestion fiches personnalisées |
| `/parametres` | `Settings` | Clés API, import JSON |

---

## Catégories de fiches

| ID | Label | Icone | Couleur |
|---|---|---|---|
| `secours-personne` | Secours à la Personne | 🩺 | `#CC0000` |
| `incendie-evacuation` | Incendie & Évacuation | 🔥 | `#FF6B35` |
| `chimique` | Risque Chimique | ☣️ | `#8B00FF` |
| `nrbc` | NRBC | ☢️ | `#FFD700` (texte `#0D0D0D`) |
| `environnement-exterieur` | Environnement & Extérieur | 🌍 | `#27AE60` |
| `professionnel-industriel` | Professionnel / Industriel | 🏭 | `#E67E22` |
| `evenementiel-foule` | Événementiel / Foule | 👥 | `#3498DB` |
| `pediatrie` | Pédiatrie Spécifique | 👶 | `#E91E8C` |
| `psychologique` | Psychologique / Comportemental | 🤯 | `#9B59B6` |

Niveaux de danger : `standard` (#2ECC71) · `élevé` (#F39C12) · `critique` (#CC0000)

---

## Schéma JSON d'une fiche

Champs obligatoires : `id`, `titre`, `categorie`, `tags`, `niveauDanger`, `objectif`, `actionsImmédiates`, `procedureAction`

Champs optionnels notables :
- `nrbc` — données spécifiques NRBC (type N/R/B/C, EPI, décontamination…)
- `chimique` — produit, voies d'exposition, seuils, EPI minimum
- `diagnosticRapide` — visuels / auditifs / comportementaux
- `securiteAvantAction` — risques intervenant, EPI requis, règle universelle
- `scriptAlerte` — numéro, quoi dire, infos à fournir
- `arbresDecision` — tableau `{ condition, alors }`
- `notesCritiques` — points d'attention absolus
- `pointsControle` — checklist de vérification
- `siSecoursTardent` — actions, ressources improvisées, signes d'aggravation, limites
- `zonesIntervention` — zones rouge / orange / verte
- `decontamination` — protocole, point de décontamination

---

## Persistance (localStorage)

| Clé | Contenu |
|---|---|
| `urgentor_fiches_custom` | Tableau JSON des fiches créées/importées par l'utilisateur |
| `urgentor_settings` | Clés API et modèles sélectionnés (Anthropic, OpenAI, OpenRouter) |
| `urgentor_notes_<id>` | Notes libres par fiche (hook `useNotes`) |

---

## Fonctionnalités clés

### Recherche (SearchBar)
- Normalisation NFD pour recherche sans accents (`brulure` → `brûlure`)
- Autocomplete avec score : titre-début (100) > titre-contient (80) > tags (50) > objectif (30) > catégorie (20)
- Max 5 suggestions, navigation clavier (↑↓ Enter Esc), navigation directe au tap
- Highlight de la correspondance dans le titre (positions NFD alignées avec l'original)

### Text-to-Speech (useSpeech + SpeakButton)
- Voix française : `fr-FR` → `fr-*` → défaut navigateur
- Android Chrome : chargement asynchrone via événement `voiceschanged` (module-level cache)
- iOS/Android WebView : keepalive `setInterval` toutes les 8s pour contourner le bug de pause (~15s)
- Une seule section parle à la fois (module-level `stopPrevious`)
- Chaque section de `FicheDetail` a son propre `SpeakButton` avec texte TTS dédié

### Import de fiches (Settings)
- Zone drag-and-drop + sélecteur de fichier
- Accepte un tableau JSON ou une fiche JSON unique
- Validation : champs `id` et `titre` requis
- Dédoublonnage par `id` (pas d'écrasement des fiches existantes)
- Lien vers `/gestion` après import réussi

### Génération IA (AIGenerator)
- Providers : Anthropic, OpenAI, OpenRouter (modèles dynamiques)
- System prompt structuré produisant le JSON complet de fiche
- Clés API stockées en localStorage, jamais envoyées à un backend

### Aide contextuelle (HelpPanel)
- Bouton `?` dans la Navbar (à gauche de la roue paramètres)
- Panneau slide-in depuis la droite, backdrop semi-transparent
- Contenu différent selon la route active : `/`, `/fiche/*`, `/parametres`, `/nouvelle-fiche`, `/gestion`
- Fermeture : bouton, clic backdrop, touche Escape
- Scroll lock sur `body` pendant l'ouverture

---

## PWA & déploiement

- `vite.config.js` — manifest complet, précache 16 entrées, runtime cache Google Fonts
- `netlify.toml` — build `npm run build` / publish `dist`, SPA redirect `/* → /index.html 200`
- Headers de sécurité (X-Frame-Options, X-Content-Type-Options…)
- Cache long terme `/assets/*` (immutable), no-cache pour `sw.js`, `workbox-*.js`, manifest
- `public/_redirects` — fallback Netlify SPA
- Icons : `pwa-192x192.png`, `pwa-512x512.png` (maskable), `apple-touch-icon.png`, `urgentor-icon.svg`

---

## Charte visuelle

- Fond principal : `#1A1A2E`
- Fond carte/input : `#16213e`
- Accent rouge : `#CC0000`
- Texte principal : `#f0f0f0`
- Texte secondaire : `#9ca3af`
- Séparateurs : `#2a2a4a`
- Police titres : Oswald (letterspacing 2-3px)
- Police corps : IBM Plex Sans
- Police mono : IBM Plex Mono
- Touch targets min : 44×44px
- Safe area : `env(safe-area-inset-*)` sur Navbar et conteneurs principaux
- Hauteur viewport : `100dvh` (dynamic viewport height, mobile)

---

## Fiches intégrées (builtin)

10 fiches statiques importées dans `ficheIndex.js` :

| ID | Catégorie |
|---|---|
| `malaise-cardiaque` | secours-personne |
| `hemorragie-grave` | secours-personne |
| `brulure-thermique` | secours-personne |
| `noyade` | secours-personne |
| `incendie` | incendie-evacuation |
| `evacuation` | incendie-evacuation |
| `fuite-gaz` | chimique |
| `deversement-chimique` | chimique |
| `alerte-radiologique` | nrbc |
| `alerte-chimique-nrbc` | nrbc |

Les 5 nouvelles catégories (`environnement-exterieur`, `professionnel-industriel`, `evenementiel-foule`, `pediatrie`, `psychologique`) n'ont pas encore de fiches builtin — elles sont prêtes à recevoir des fiches créées via l'IA ou importées manuellement.
