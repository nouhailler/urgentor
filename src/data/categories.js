export const CATEGORIES = [
  {
    id: "secours-personne",
    label: "Secours à Personne",
    couleur: "#CC0000",
    icone: "🚑",
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
  }
]

export const getCategorieById = (id) => CATEGORIES.find(c => c.id === id)

export const DANGER_COLORS = {
  standard: "#2ECC71",
  élevé: "#F39C12",
  critique: "#CC0000"
}
