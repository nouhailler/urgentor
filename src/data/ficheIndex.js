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
import noyadeEauVive from './fiches/environnement-exterieur/noyade-eau-vive.json'
import chuteHauteur from './fiches/environnement-exterieur/chute-hauteur.json'
import ensevelissement from './fiches/environnement-exterieur/ensevelissement.json'
import foudre from './fiches/environnement-exterieur/foudre.json'
import inondation from './fiches/environnement-exterieur/inondation.json'
import glissade from './fiches/environnement-exterieur/glissade.json'
import perteOrientation from './fiches/environnement-exterieur/perte-orientation.json'
import froidExtreme from './fiches/environnement-exterieur/froid-extreme.json'
import projectionOeil from './fiches/professionnel-industriel/projection-oeil.json'
import amputation from './fiches/professionnel-industriel/amputation.json'
import espaceConfine from './fiches/professionnel-industriel/espace-confine.json'
import brulureHauteTension from './fiches/professionnel-industriel/brulure-haute-tension.json'
import intoxicationInhalation from './fiches/professionnel-industriel/intoxication-inhalation.json'
import ecrasement from './fiches/professionnel-industriel/ecrasement.json'
import incendieVehicule from './fiches/professionnel-industriel/incendie-vehicule.json'
import deversementBiologique from './fiches/professionnel-industriel/deversement-biologique.json'
import agression from './fiches/professionnel-industriel/agression.json'
import malaiseIsole from './fiches/professionnel-industriel/malaise-isole.json'
import bousculade from './fiches/evenementiel-foule/bousculade.json'
import malaiseConfine from './fiches/evenementiel-foule/malaise-confine.json'
import enfantPerdu from './fiches/evenementiel-foule/enfant-perdu.json'
import intoxicationCollective from './fiches/evenementiel-foule/intoxication-collective.json'
import paniqueCollective from './fiches/evenementiel-foule/panique-collective.json'
import fievreEnfant from './fiches/pediatrie/fievre-enfant.json'
import convulsionsFebriles from './fiches/pediatrie/convulsions-febriles.json'
import ingestionToxique from './fiches/pediatrie/ingestion-toxique.json'
import brulureEnfant from './fiches/pediatrie/brulure-enfant.json'
import traumaNourrisson from './fiches/pediatrie/trauma-nourrisson.json'
import crisePanique from './fiches/psychologique/crise-panique.json'
import detressePsychologique from './fiches/psychologique/detresse-psychologique.json'
import agitation from './fiches/psychologique/agitation.json'
import chocPsychologique from './fiches/psychologique/choc-psychologique.json'
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
  noyadeEauVive,
  chuteHauteur,
  ensevelissement,
  foudre,
  inondation,
  glissade,
  perteOrientation,
  froidExtreme,
  projectionOeil,
  amputation,
  espaceConfine,
  brulureHauteTension,
  intoxicationInhalation,
  ecrasement,
  incendieVehicule,
  deversementBiologique,
  agression,
  malaiseIsole,
  bousculade,
  malaiseConfine,
  enfantPerdu,
  intoxicationCollective,
  paniqueCollective,
  fievreEnfant,
  convulsionsFebriles,
  ingestionToxique,
  brulureEnfant,
  traumaNourrisson,
  crisePanique,
  detressePsychologique,
  agitation,
  chocPsychologique,
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
