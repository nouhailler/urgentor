export const CATEGORIES = [
  {
    id: "secours-personne",
    label: "Secours à la Personne",
    couleur: "#C2415A",
    icone: "🩺",
    description: "Malaise, hémorragie, brûlure, noyade, inconscience"
  },
  {
    id: "incendie-evacuation",
    label: "Incendie & Évacuation",
    couleur: "#D2762E",
    icone: "🔥",
    description: "Début d'incendie, évacuation de bâtiment, feu de classe"
  },
  {
    id: "chimique",
    label: "Risque Chimique",
    couleur: "#7A5AA6",
    icone: "☣️",
    description: "Fuite de gaz, déversement, intoxication par produit chimique",
    niveauDanger: "élevé",
    equipementObligatoire: true
  },
  {
    id: "nrbc",
    label: "NRBC",
    couleur: "#B08A1E",
    couleurTexte: "#0D0D0D",
    icone: "☢️",
    description: "Nucléaire, Radiologique, Biologique, Chimique — protocoles spéciaux",
    niveauDanger: "critique",
    equipementObligatoire: true,
    accesRestreint: false
  },
  {
    id: "environnement-exterieur",
    label: "Environnement & Extérieur",
    couleur: "#2F8F6B",
    icone: "🌍",
    description: "Morsures, piqûres, hypothermie, avalanche, foudre, naufrage"
  },
  {
    id: "professionnel-industriel",
    label: "Professionnel / Industriel",
    couleur: "#B06A3A",
    icone: "🏭",
    description: "Accidents du travail, écrasements, chutes en hauteur, électrisation"
  },
  {
    id: "evenementiel-foule",
    label: "Événementiel / Foule",
    couleur: "#3A77B0",
    icone: "👥",
    description: "Mouvement de foule, bousculade, malaise de masse, attentat"
  },
  {
    id: "pediatrie",
    label: "Pédiatrie Spécifique",
    couleur: "#C25C92",
    icone: "👶",
    description: "Réanimation nourrisson, étouffement enfant, convulsions fébriles"
  },
  {
    id: "psychologique",
    label: "Psychologique / Comportemental",
    couleur: "#6E73C0",
    icone: "🤯",
    description: "État de choc psychologique, crise de panique, comportement agressif"
  }
]

export const getCategorieById = (id) => CATEGORIES.find(c => c.id === id)

// Palette de sévérité — alignée sur les tokens --sev-* (thème Clair)
export const DANGER_COLORS = {
  standard: "#1E8A5A",
  élevé: "#B5740A",
  critique: "#C8102E"
}

// Couleurs texte + fond de badge par niveau (cf. tokens --sev-*)
export const SEVERITY = {
  standard: { color: "#1E8A5A", bg: "#E7F4EC", label: "STANDARD" },
  élevé:    { color: "#B5740A", bg: "#FBF1DD", label: "ÉLEVÉ" },
  critique: { color: "#C8102E", bg: "#FCEBEE", label: "CRITIQUE" }
}

export const getSeverity = (niveau) => SEVERITY[niveau] ?? SEVERITY.standard
