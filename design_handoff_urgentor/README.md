# Handoff — URGENTOR · Redesign « Clair » + « Nuit »

## Overview

URGENTOR is an **offline-first first-aid reference app** (French — *fiches de premiers secours*). Responders browse a library of emergency procedure cards, open a detailed card during an incident (immediate actions, alert script, decision tree, critical notes), create new cards (AI-generated or manual), manage their card collection, and configure AI provider API keys.

This bundle delivers the redesigned UI in two themes — **Clair** (light, default) and **Nuit** (dark, for low-light / night intervention). It covers both the **desktop/web** layout and the **mobile (iOS)** layout.

---

## About the design files

The files in this bundle are **design references created in HTML** — prototypes that show the intended look, layout, and behavior. **They are not production code to copy directly.**

Your task: **recreate these designs inside the target codebase's existing environment** (React, Vue, Svelte, SwiftUI, native, etc.), using its established component patterns, routing, and state management. If no environment exists yet, choose the most appropriate framework and implement there. Treat `tokens.css` as the canonical source of colors, type, radii, and shadows — wire those values into whatever theming system the codebase uses (CSS variables, Tailwind config, a theme object, etc.).

> The HTML uses a small custom templating runtime (`<x-dc>`, `support.js`, `ios-frame.jsx`). **Ignore that machinery** — it is only the prototyping harness. Read the markup for structure, copy, spacing, and the inline `style="..."` values for exact specs.

### Files in this bundle
| File | What it is |
|---|---|
| `tokens.css` | **Canonical design tokens** — light + night, as CSS custom properties. Start here. |
| `Urgentor Clair.dc.html` | Desktop/web prototype — all 5 screens, with working nav, search, and category filtering. |
| `Urgentor Clair - Mobile.dc.html` | Mobile prototype — 8 phone frames (5 light + 3 night) inside iOS device bezels. |
| `screenshots/` | PNG renders of every screen (light + night, desktop + mobile) — see below. |
| `ios-frame.jsx` | The iOS bezel wrapper used by the mobile prototype (prototype harness only — do not ship). |
| `support.js` | Prototype runtime (harness only — do not ship). |

### Screenshots (`screenshots/`)
Static renders for quick reference (open the `.dc.html` files for live, scrollable, full-height versions).
- `desktop-01-bibliotheque.png` · `desktop-02-fiche.png` · `desktop-03-nouvelle-fiche.png` · `desktop-04-gestion.png` · `desktop-05-parametres.png` — the 5 desktop screens, theme Clair (top-of-screen crops; scroll the prototype for full pages).
- `mobile-clair-row.png` — the 5 mobile screens in theme Clair (Bibliothèque · Fiche · Nouvelle fiche · Gestion · Paramètres).
- `mobile-nuit-row.png` — the 3 mobile screens in theme Nuit (Bibliothèque · Fiche · Paramètres).

---

## Fidelity

**High-fidelity (hifi).** Colors, typography, spacing, and radii are final and exact — pull them from `tokens.css` and the inline styles. Recreate pixel-for-pixel using the codebase's component library. Interactions shown (screen switching, search filter, category toggle, segmented control) are real and define the intended behavior.

---

## Design system

### Typography (Google Fonts)
- **Archivo** (500/600/700/800) — display: headings, card titles, logo wordmark, step numbers.
- **IBM Plex Sans** (400/500/600) — body copy and UI controls.
- **IBM Plex Mono** (400/500/600) — eyebrows, category labels, tags, phone numbers, all-caps micro-labels.

Type scale (desktop): see the commented scale block at the top of `tokens.css`. Mobile shrinks H1 to 24px and fiche H1 to 26px.

### Color, radii, shadows
All defined in `tokens.css`. Two themes via `[data-theme="dark"]`. Highlights:
- **Brand red** `--brand` (#C8102E light / #E23E54 night) — logo, FAB, critical severity.
- **Dark navy ink** `--ink` (#1E2A37) — primary buttons, phone-number tiles.
- **Teal accent** `--accent` (#0E7180 light / #3FB6C4 night) — links, active nav, focus rings, eyebrows.
- **Severity scale** — `standard` (green), `élevé` (amber), `critique` (red). Badge = `--sev-*` text on `--sev-*-bg`, border = the color at ~20% alpha (light) / ~30% (night).
- Cards `--radius-card` 16px; controls 10px; search 12px; pills 999px.

### Iconography
Outline SVGs, `stroke-width` 1.8–2, `stroke="currentColor"`, 15–23px. Category pictograms are simple line icons (waveform = secours, flame = incendie, droplet = chimique, triangle = NRBC, etc.). Use the codebase's existing icon set with equivalent outline glyphs; match stroke weight.

---

## Screens / Views

> Desktop max content width: **1060px** (library/management), **780px** (fiche detail), **760px** (new / settings), centered. Mobile frames are **402px** wide (iPhone), content padding 14px, sticky bottom tab bar.

### 1 · Bibliothèque (Library) — home
- **Purpose:** browse and find first-aid cards.
- **Layout:** eyebrow + H1 + sub ("N fiches…") → search field → wrapping row of category filter chips → responsive card grid (`repeat(auto-fill, minmax(296px, 1fr))`, gap 16px).
- **Card:** `--surface`, 1px `--border`, radius 14px, padding 18px 18px 16px. Top row = category pictogram + mono label (left) and severity badge (right). Then H3 title (Archivo 18/700), description (`--text-secondary` 13.5px), then tag pills (mono, `--chip-bg`). Hover: border `--border-hover`, `--shadow-card-hover`, `translateY(-2px)`.
- **Search:** full-width, radius 12px, magnifier icon inset left. Focus: border `--accent` + `--focus-ring`. Filters cards live by title/objective/tags.
- **Category chips:** pill, min-height 42px (44px touch target on mobile). Inactive = white + `--border`. Active = category color at 14% alpha bg, 1.5px category-color border, category-color text. Toggling re-filters; "✕ Effacer" appears when a category is active. Mobile: horizontal scroll, no wrap.

### 2 · Fiche détaillée (Card detail)
- **Purpose:** the working reference during an incident — read top-to-bottom under pressure.
- **Layout:** back link → vertical stack of section cards (gap 16px), max-width 780px.
- **Sections, in order:**
  1. **Header card** — 5px top accent bar (`--fiche-accent-bar`), category eyebrow + severity badge, fiche H1 (Archivo 32/800/-0.5px), objective sentence, tag pills.
  2. **Actions immédiates** — priority panel, `--panel-action-bg` / `--panel-action-border`. Red icon badge + uppercase red H2 + "≤ 3 MIN" timing pill. Numbered steps: solid red circle (30px) + bold 16px line.
  3. **Script d'alerte** — three navy phone tiles (15 SAMU / 18 POMPIERS / 112 EUROPÉEN), mono numbers 26px. "Écouter" (TTS) outline button. Quoted script block: `--surface-subtle`, 3px left border `--ink`, mono 13.5px. "Informations à fournir" list with teal `→` markers.
  4. **Procédure d'action** — numbered steps, square navy badges (27px, radius 8px) + body lines. "Écouter" button.
  5. **Sécurité avant action** — amber heading; callout fill `--panel-warn-soft`; two columns: "Risques intervenant" (amber `▸`) and "Équipements requis" (green `✓`).
  6. **Arbre de décision** — SI → ALORS rows: bordered row split into a `--surface-subtle` "SI" cell (amber label) + arrow + "ALORS" cell (green label).
  7. **Notes critiques** — red heading; lines prefixed with bold red `!`.
  8. **Points de contrôle** — green heading; checkbox squares (20px, 1.5px green border, ✓).
  9. **Si les secours tardent** — amber warning panel `--panel-warn-bg`; italic condition; numbered actions; two sub-cards ("Ressources de fortune" / "Signes d'aggravation" with red `▲`).
  10. **Avertissement médical** — muted gray legal disclaimer block.
  11. **Notes personnelles** — textarea, autosaved to localStorage (mono helper "Sauvegarde automatique — stockage local").
- **Mobile** keeps header / actions / alert-script sections; numbers grid stays 3-up.

### 3 · Nouvelle fiche (New card)
- **Purpose:** create a card via AI or manually.
- **Layout:** eyebrow + H1 + sub → segmented control ("✦ Génération IA" / "Saisie manuelle") in a `#EBEEF2` track, active segment = white + `--shadow-seg-active`.
- **IA mode:** title input; two-column selects (Catégorie / Modèle IA); amber inline notice "Une clé API est requise → Paramètres"; full-width navy "✦ Générer la fiche"; dashed preview placeholder below.
- **Manual mode:** title input; danger-level selector (3 segmented pills STANDARD/ÉLEVÉ/CRITIQUE, active = green border + tint); objective textarea; navy "Continuer dans l'éditeur".

### 4 · Gestion (Management)
- **Purpose:** import / export / edit / delete cards.
- **Layout:** header row with title + "10 officielles · 2 personnelles" and two outline buttons (Importer JSON / Tout exporter). Then a single `--surface` list card, rows divided by `--divider`.
- **Row:** category pictogram + title + mono slug; severity badge; source tag — **Officielle** (lock icon, neutral chip) or **Perso** (teal `--accent-soft`). Right-aligned icon action buttons: Officielle → Exporter + Dupliquer; Perso → Exporter + Modifier + Supprimer (delete hover = `--danger-bg` / `--danger`).

### 5 · Paramètres (Settings)
- **Purpose:** configure AI provider keys; import cards.
- **Layout:** "Clés API" section — note "Stockées uniquement sur cet appareil". One card per provider (Anthropic Claude, OpenAI GPT, OpenRouter): status dot + name; status pill **Configurée** (green) / **Non configurée** (amber); password input (`--surface-input`, mono) + model select. Then "Import de fiches" — dashed drop zone with upload icon, "Glisser-déposer un fichier JSON", navy "Choisir un fichier".

---

## Interactions & behavior
- **Navigation:** desktop = top nav (Bibliothèque / Gérer + Nouvelle-fiche CTA + help/settings icons). Mobile = sticky bottom tab bar (Bibliothèque / Gérer / + FAB / Réglages), active item in `--accent` (light) / `--accent` teal (night). (The prototype's dark top toolbar is a meta preview switcher — **not part of the app**.)
- **Search** filters the library live (title + objective + tags, case-insensitive).
- **Category chips** toggle a single active filter; re-click or "Effacer" clears.
- **Segmented controls** (new-card mode, danger level) switch instantly.
- **Hover:** cards lift + shadow; outline buttons gain teal border/text; icon buttons get a subtle gray fill.
- **Focus:** inputs/textarea → `--accent` border + `--focus-ring`.
- **"Écouter" buttons** → intended text-to-speech playback of the section.
- **Notes personnelles** → autosave to local storage.
- **Theme:** Clair default; Nuit is a full dark palette swap (see `tokens.css`). Wire to a user toggle and/or `prefers-color-scheme`.
- **Transitions:** card hover `.12s` on transform/box-shadow/border-color.

## State
- `screen` — active view (home / fiche / new / gestion / settings).
- `cat` — active category filter (nullable).
- `q` — search query string.
- `newMode` — `ia` | `manual`.
- `theme` — `clair` | `nuit`.
- Per-card: notes draft (persisted locally). Settings: API keys + selected models (persisted locally, never sent to a third-party server).

## Data model (per fiche)
`id`, `catId` (category), `sev` (`standard|élevé|critique`), `titre`, `objectif`, `tags[]`, plus detail sections: immediate actions, alert script, procedure steps, safety (risks + equipment), decision tree (SI→ALORS), critical notes, checkpoints, "if help is delayed", and source (`officielle` | `perso`). Cards import/export as JSON (one card or an array).

## Categories
secours-personne · incendie-evacuation · chimique · nrbc · environnement-exterieur · professionnel-industriel · evenementiel-foule · pediatrie · psychologique. Accent colors in `tokens.css` (`--cat-*`).

## Assets
No raster assets. Logo is the URGENTOR red rounded square with a white "plus/cross" glyph (inline SVG — recreate as an icon component). All other icons are outline SVGs; substitute the codebase's icon set at matching stroke weight (1.8–2). Fonts load from Google Fonts.
