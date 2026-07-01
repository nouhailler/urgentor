import malaise from './fiches/secours-personne/malaise.json'
import hemorragie from './fiches/secours-personne/hemorragie.json'
import brulure from './fiches/secours-personne/brulure.json'
import noyade from './fiches/secours-personne/noyade.json'
import arretCardiaque from './fiches/secours-personne/arret-cardiaque.json'
import etouffement from './fiches/secours-personne/etouffement.json'
import convulsions from './fiches/secours-personne/convulsions.json'
import hypoglycemie from './fiches/secours-personne/hypoglycemie.json'
import avc from './fiches/secours-personne/avc.json'
import detresseRespiratoire from './fiches/secours-personne/detresse-respiratoire.json'
import anaphylaxie from './fiches/secours-personne/anaphylaxie.json'
import traumaCrane from './fiches/secours-personne/trauma-crane.json'
import fracture from './fiches/secours-personne/fracture.json'
import brulureChimique from './fiches/secours-personne/brulure-chimique.json'
import electrisation from './fiches/secours-personne/electrisation.json'
import hypothermie from './fiches/secours-personne/hypothermie.json'
import coupChaleur from './fiches/secours-personne/coup-chaleur.json'
import morsurePiqure from './fiches/secours-personne/morsure-piqure.json'
import accouchementUrgence from './fiches/secours-personne/accouchement-urgence.json'
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
  arretCardiaque,
  etouffement,
  convulsions,
  hypoglycemie,
  avc,
  detresseRespiratoire,
  anaphylaxie,
  traumaCrane,
  fracture,
  brulureChimique,
  electrisation,
  hypothermie,
  coupChaleur,
  morsurePiqure,
  accouchementUrgence,
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
