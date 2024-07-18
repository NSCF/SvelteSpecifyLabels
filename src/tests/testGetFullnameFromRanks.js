import { getFullnameFromRanks } from "../lib/getLabelDet.js";

const subspecies = {
  order: 'Scorpiones',
  family: 'Buthidae',
  genus: 'Parabuthus',
  species: 'transvaalicus',
  subspecies:'transvaalicus',
}

const species = {
  order: 'Scorpiones',
  family: 'Buthidae',
  genus: 'Parabuthus',
  species: 'transvaalicus',
  subspecies:'',
}

const genus = {
  order: 'Scorpiones',
  family: 'Buthidae',
  genus: 'Parabuthus',
  species: '',
  subspecies:'',
}

const family = {
  order: 'Scorpiones',
  family: 'Buthidae',
  genus: '',
  species: '',
  subspecies:'',
}

const fullSubspeciesName = getFullnameFromRanks(subspecies, false, true)
const fullSpeciesName = getFullnameFromRanks(species)
const fullGenusName = getFullnameFromRanks(genus, true, true)
const fullFamilyName = getFullnameFromRanks(family, true, true)
let i = 0

