export const CATEGORIES = [
  {
    id: "secours-personne",
    label: "Secours à la Personne",
    couleur: "#CC0000",
    icone: "🩺",
    description: "Malaise, hémorragie, brûlure, noyade, inconscience"
  },
  {
    id: "incendie-evacuation",
    label: "Incendie & Évacuation",
    couleur: "#FF6B35",
    icone: "🔥",
    description: "Début d'incendie, évacuation de bâtiment, feu de classe"
  },
  {
    id: "chimique",
    label: "Risque Chimique",
    couleur: "#8B00FF",
    icone: "☣️",
    description: "Fuite de gaz, déversement, intoxication par produit chimique",
    niveauDanger: "élevé",
    equipementObligatoire: true
  },
  {
    id: "nrbc",
    label: "NRBC",
    couleur: "#FFD700",
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
    couleur: "#27AE60",
    icone: "🌍",
    description: "Morsures, piqûres, hypothermie, avalanche, foudre, naufrage"
  },
  {
    id: "professionnel-industriel",
    label: "Professionnel / Industriel",
    couleur: "#E67E22",
    icone: "🏭",
    description: "Accidents du travail, écrasements, chutes en hauteur, électrisation"
  },
  {
    id: "evenementiel-foule",
    label: "Événementiel / Foule",
    couleur: "#3498DB",
    icone: "👥",
    description: "Mouvement de foule, bousculade, malaise de masse, attentat"
  },
  {
    id: "pediatrie",
    label: "Pédiatrie Spécifique",
    couleur: "#E91E8C",
    icone: "👶",
    description: "Réanimation nourrisson, étouffement enfant, convulsions fébriles"
  },
  {
    id: "psychologique",
    label: "Psychologique / Comportemental",
    couleur: "#9B59B6",
    icone: "🤯",
    description: "État de choc psychologique, crise de panique, comportement agressif"
  }
]

export const getCategorieById = (id) => CATEGORIES.find(c => c.id === id)

export const DANGER_COLORS = {
  standard: "#2ECC71",
  élevé: "#F39C12",
  critique: "#CC0000"
}
