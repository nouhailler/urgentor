# 🚨 URGENTOR — Fiches de Premiers Secours

> Application web progressive (PWA) de référence pour les premières interventions d'urgence — **utilisable hors ligne**, sur mobile comme sur desktop.

---

## 🎯 À quoi ça sert ?

**Urgentor** centralise des fiches opérationnelles de premiers secours, structurées et claires, pour intervenir rapidement et efficacement face à une situation d'urgence — même sans connexion internet.

Chaque fiche couvre :
- ✅ Les **actions immédiates** (dans les 30 premières secondes)
- 📋 La **procédure pas à pas** numérotée
- 📞 Le **script d'alerte** (quoi dire au 15 / 18 / 112)
- 🌳 Les **arbres de décision** (« Si… alors… »)
- ⚠️ Les **signes d'aggravation** à surveiller
- ⏳ La section **« Si les secours tardent »** — que faire si l'aide professionnelle met du temps à arriver
- 🔴 Les **notes critiques** et contre-indications

---

## 📂 Catégories de fiches

| Icône | Catégorie | Contenu |
|-------|-----------|---------|
| 🩺 | **Secours à la personne** | Malaise cardiaque, hémorragie, brûlure, noyade |
| 🔥 | **Incendie & Évacuation** | Conduite à tenir en cas d'incendie, procédure d'évacuation |
| ☣️ | **Risque chimique** | Fuite de gaz, déversement chimique |
| ☢️ | **NRBC** | Alerte radiologique, alerte chimique NRBC |

---

## ✨ Fonctionnalités

### 📖 Bibliothèque de fiches
- **10 fiches officielles** pré-chargées, validées sur références HAS / INRS / Ministère de l'Intérieur
- Recherche textuelle instantanée (titre, tags, objectif)
- Filtrage par catégorie
- Affichage adapté aux situations NRBC (bandeau clignotant, code couleur danger)

### 🤖 Génération de fiches par IA
- Génération automatique de nouvelles fiches à partir d'un titre et d'une catégorie
- Compatible **Anthropic Claude**, **OpenAI GPT**, **OpenRouter** (modèles `:free`)
- Sélection dynamique du modèle OpenRouter (liste actualisée depuis l'API)
- Prévisualisation avant sauvegarde

### 📝 Notes personnelles
- Zone de notes libre par fiche, sauvegardée localement
- Auto-save avec debounce (600 ms)
- Indicateur visuel sur les fiches annotées

### ⚙️ Gestion des fiches
- Créer des fiches personnalisées (manuellement ou via IA)
- Modifier les fiches custom via éditeur JSON intégré (validation temps réel)
- Protection des fiches officielles — fork en un clic
- Suppression avec confirmation
- **Import / Export** au format JSON (fiche par fiche ou en lot)

### 📴 Mode hors ligne (PWA)
- Installation sur l'écran d'accueil (iOS / Android / Desktop)
- Cache service worker — toutes les fiches disponibles sans réseau
- Données stockées dans le navigateur (localStorage)

---

## 🏗️ Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | **React 19** |
| Build | **Vite 8** |
| Styles | **Tailwind CSS v4** (`@tailwindcss/vite`) |
| Routing | **React Router v7** |
| PWA | **vite-plugin-pwa v1.2** (Workbox, generateSW) |
| Typo | Oswald · IBM Plex Sans · IBM Plex Mono |
| Stockage | `localStorage` (fiches, notes, paramètres, cache modèles) |

---

## 🚀 Démarrage rapide

```bash
# Cloner le dépôt
git clone https://github.com/nouhailler/urgentor.git
cd urgentor

# Installer les dépendances
npm install --legacy-peer-deps

# Lancer en développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

---

## 🔑 Configuration des clés API *(optionnel)*

Pour utiliser la génération de fiches par IA, configurez vos clés dans **Paramètres** (icône ⚙️ dans la navbar) :

| Fournisseur | Modèles | Clé |
|-------------|---------|-----|
| 🟣 **Anthropic** | claude-3-5-haiku, claude-opus-4 | `sk-ant-...` |
| 🟢 **OpenAI** | gpt-4o-mini, gpt-4o | `sk-...` |
| 🔵 **OpenRouter** | tous les modèles `:free` | `sk-or-...` |

> Les clés sont stockées **uniquement dans votre navigateur** (localStorage), jamais transmises à un serveur tiers.

---

## 📁 Structure du projet

```
urgentor/
├── public/                    # Icônes PWA, manifest
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Barre de navigation sticky
│   │   ├── FicheCard.jsx      # Carte résumé d'une fiche
│   │   ├── FicheDetail.jsx    # Vue complète d'une fiche
│   │   ├── AIGenerator.jsx    # Générateur IA de fiches
│   │   ├── SearchBar.jsx      # Barre de recherche
│   │   ├── NRBCBadge.jsx      # Badge danger NRBC
│   │   └── DiagramVisuel.jsx  # Arbre de décision visuel
│   ├── pages/
│   │   ├── Home.jsx           # Bibliothèque + recherche
│   │   ├── FichePage.jsx      # Affichage d'une fiche
│   │   ├── NewFiche.jsx       # Création de fiche (manuel / IA)
│   │   ├── GestionFiches.jsx  # Import / export / suppression
│   │   ├── EditFiche.jsx      # Éditeur JSON intégré
│   │   └── Settings.jsx       # Paramètres clés API
│   ├── hooks/
│   │   ├── useFiches.js       # CRUD fiches + filtrage
│   │   ├── useNotes.js        # Notes par fiche (localStorage)
│   │   ├── useSettings.js     # Gestion clés API
│   │   └── useOpenRouterModels.js  # Modèles OpenRouter dynamiques
│   └── data/
│       ├── categories.js
│       ├── ficheIndex.js
│       └── fiches/
│           ├── secours-personne/    # malaise, hémorragie, brûlure, noyade
│           ├── incendie-evacuation/ # incendie, évacuation
│           ├── chimique/            # fuite-gaz, déversement-chimique
│           └── nrbc/                # alerte-radiologique, alerte-chimique-nrbc
├── vite.config.js
└── package.json
```

---

## 🗂️ Format d'une fiche JSON

Chaque fiche est un fichier `.json` avec la structure suivante :

```json
{
  "id": "slug-unique",
  "titre": "Hémorragie externe grave",
  "categorie": "secours-personne",
  "tags": ["saignement", "compression", "garrot"],
  "niveauDanger": "critique",
  "source": "officielle",
  "objectif": "Contrôler le saignement et maintenir en vie jusqu'aux secours",
  "actionsImmédiates": ["Comprimer immédiatement", "Appeler le 15"],
  "procedureAction": [{ "etape": 1, "action": "..." }],
  "scriptAlerte": { "numero": "15", "quoiDire": "..." },
  "arbresDecision": [{ "condition": "Saignement abondant", "alors": "Garrot" }],
  "siSecoursTardent": {
    "contexte": "Si les secours sont à plus de 20 min",
    "actions": ["Maintenir la compression", "..."],
    "signesAggravation": ["Pâleur", "Confusion"],
    "limitesSansSecours": "Choc hémorragique sans transfusion = risque vital"
  },
  "notesCritiques": ["Ne jamais retirer un objet empalé"],
  "avertissement": "Information indicative uniquement"
}
```

---

## ⚠️ Avertissement légal

> Les informations contenues dans cette application sont **indicatives** et à but éducatif uniquement. Elles ne remplacent pas une formation certifiée aux premiers secours (PSC1, PSE1, AFGSU, etc.) ni l'avis d'un professionnel de santé.
>
> **En cas d'urgence, appelez toujours le 15 (SAMU), le 18 (Pompiers) ou le 112 (Numéro européen d'urgence).**

---

## 📄 Licence

Projet personnel — usage libre à des fins éducatives et non commerciales.

---

<div align="center">
  <strong>🚨 URGENTOR</strong> — Chaque seconde compte.<br/>
  Fait avec ❤️ pour que vous soyez prêts quand ça compte vraiment.
</div>
