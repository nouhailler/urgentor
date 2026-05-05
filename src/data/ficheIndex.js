import malaise from './fiches/secours-personne/malaise.json'
import hemorragie from './fiches/secours-personne/hemorragie.json'
import brulure from './fiches/secours-personne/brulure.json'
import noyade from './fiches/secours-personne/noyade.json'
import incendie from './fiches/incendie-evacuation/incendie.json'
import evacuation from './fiches/incendie-evacuation/evacuation.json'
import fuiteGaz from './fiches/chimique/fuite-gaz.json'
import deversementChimique from './fiches/chimique/deversement-chimique.json'
import alerteRadiologique from './fiches/nrbc/alerte-radiologique.json'
import alerteChimiqueNrbc from './fiches/nrbc/alerte-chimique-nrbc.json'

export const TOUTES_FICHES = [
  malaise,
  hemorragie,
  brulure,
  noyade,
  incendie,
  evacuation,
  fuiteGaz,
  deversementChimique,
  alerteRadiologique,
  alerteChimiqueNrbc
]

export const getFicheById = (id) => TOUTES_FICHES.find(f => f.id === id)

export const getFichesByCategorie = (categorieId) =>
  TOUTES_FICHES.filter(f => f.categorie === categorieId)

export const searchFiches = (query) => {
  if (!query || query.trim() === '') return TOUTES_FICHES
  const q = query.toLowerCase()
  return TOUTES_FICHES.filter(f =>
    f.titre.toLowerCase().includes(q) ||
    f.objectif.toLowerCase().includes(q) ||
    f.tags.some(t => t.toLowerCase().includes(q)) ||
    f.categorie.toLowerCase().includes(q)
  )
}
