import removeDuplicateNameParts from "./removeDuplicateNameParts.js"

const infraSpecificRanks = {
  subspecies: 'subsp.',
  variety: 'var.',
  subvariety: 'subvar.',
  form: 'f.',
  subform: 'subf.',
  forma: 'f.',
  subforma: 'subf.'
}

//this is used differently to above
const rankParts = ['subsp', 'var', 'subvar', 'f', 'subf']

const prefixQualifiers = ['aff.', 'cf.', 'nr']
const suffixQualifiers = ['sensu lato', 'sensu stricto', 's.l.', 's.s.']

const notItalics = [...Object.values(infraSpecificRanks), ...prefixQualifiers, ...suffixQualifiers, 'sp.', 'sp', 'ex', 'auct', 'auct.', '&', 'and', 'et', 'et.', 'al.', 'alia']

export default function getLabelDet(labelRecord, includeAuthority, includeInfraspecificRanks, addItalics, abbreviateSensu = false) {

  let labelDet

  if (!labelRecord) return null

  // Override qualifier if we need to abbreviate sensu lato/stricto
  let qualifier = labelRecord.identificationQualifier
  if (qualifier && abbreviateSensu) {
    const qLower = qualifier.toLowerCase().trim()
    if (qLower === 'sensu lato') {
      qualifier = 's.l.'
    } else if (qLower === 'sensu stricto') {
      qualifier = 's.s.'
    }
  }

  const record = { ...labelRecord, identificationQualifier: qualifier }

  // we prioritize verbatimDet, although we can't have italics
  // we assume that verbatim det will have the qualifiers, etc included, because that's what a verbatim det is
  if (record.verbatimIdentification) {

    labelDet = record.verbatimIdentification

    if (addItalics) {
      const nameParts = record.verbatimIdentification.split(' ').filter(x => x)
      //we need to know it's genus to italicize it
      if (record.taxonRank && record.taxonRank == 'genus') {
        nameParts[0] = '<i>' + nameParts[0] + '</i>'
      }
      else if (nameParts.length > 1 && isLowerCase(nameParts[1])
        && !nameParts[1].includes('sp.') //test if it's a species
        && !/['"]+/.test(nameParts[1]) //test if it has quotes, ie an informal name
        && !/^\d+$/.test(nameParts[1]) //test if it is a number, eg. sp. 22
      ) { //test if it's a species
        for (let i = 0; i < nameParts.length; i++) {
          const namePart = nameParts[i]
          if (notItalics.includes(namePart)) {
            continue
          }
          else if (i == 0 || isLowerCase(namePart)) {
            nameParts[i] = '<i>' + namePart + '</i>'
          }
        }
      }

      labelDet = nameParts.join(' ')

    }
  }
  else {

    //we prioritize scientificName over rank fields
    if (record.scientificName) {
      labelDet = getDetStringFromScientificName(record, includeAuthority, addItalics)
    }

    if (!labelDet) {
      labelDet = getDetStringFromRanks(record, includeAuthority, includeInfraspecificRanks, addItalics)
    }
  }

  return labelDet

}

function isRankPart(namePart) {
  return rankParts.some(rank => {
    const re = new RegExp("^" + rank + "\.?$")
    return re.test(namePart)
  })
}

function isLowerCase(namePart) {
  return namePart == namePart.toLowerCase()
}


function getDetStringFromRanks(record, includeAuthority, includeInfraspecificRanks, makeItalics) {

  //we need to walk up from the bottom and collect the necessary values
  const fields = ['order', 'superfamily', 'family', 'tribe', 'subtribe', 'genus', 'species', 'subspecies', 'variety', 'subvariety', 'forma', 'subforma']
  fields.reverse()
  let taxonRank
  let cat = true // a flag for whether to concatenate the name part
  const fullNameParts = []

  // from bottom to top, concat the names
  for (let [fieldIndex, field] of fields.entries()) {

    let taxonName = record[field]

    if (taxonName && taxonName.trim()) {

      // if we have more than one part, as may be the case for species/subspecies, we return the last bit, assuming it's the epithet
      const nameParts = taxonName.split(' ')
      taxonName = nameParts[nameParts.length - 1]

      if (!taxonRank) {
        taxonRank = field
      }

      if (makeItalics && cat) {
        fullNameParts.push('<i>' + taxonName + '</i>')
      }
      else {
        fullNameParts.push(taxonName)
      }

      if (includeInfraspecificRanks && field in infraSpecificRanks) {
        fullNameParts.push(infraSpecificRanks[field])
      }

      if (!cat) {
        break
      }

    }
    if (field == 'genus') {
      if (fullNameParts.length > 0) {
        break
      }
      else {
        cat = false
      }
    }
  }

  if (fullNameParts.length == 0) {
    return null
  }

  fullNameParts.reverse()

  // if this is plants, walk from top to bottom and remove duplicate epithets
  if (includeInfraspecificRanks) {
    removeDuplicateNameParts(fullNameParts)
  }

  let questionMark = false
  if (record.identificationConfidence) {
    if (record.identificationConfidence.toLowerCase() != 'high') {
      questionMark = true
    }
  }

  if (includeAuthority && record.scientificNameAuthorship) {
    //we dont' have any decorations on the name yet so we can safely insert the author
    let authorInsertionIndex = - 1
    let i = fullNameParts.length - 1
    if (includeInfraspecificRanks) {
      while (i - 2 > 0) {
        if (fullNameParts[i] == fullNameParts[i - 2]) {
          authorInsertionIndex = i - 2
        }
        else {
          break
        }
        i -= 2
      }
    }

    if (authorInsertionIndex < 0) {
      fullNameParts.push(record.scientificNameAuthorship)
    }
    else {
      fullNameParts.splice(authorInsertionIndex + 1, 0, record.scientificNameAuthorship)
    }
  }

  if (record.identificationQualifier) {
    if (prefixQualifiers.includes(record.identificationQualifier)) {
      fullNameParts.unshift(record.identificationQualifier)
    } else {
      fullNameParts.push(record.identificationQualifier)
    }
  }
  else if (taxonRank == 'genus' || taxonRank == 'subgenus' && (!fullNameParts.includes('sp.') && !fullNameParts.includes('sp'))) {
    fullNameParts.push('sp.')
  }

  if (questionMark) {
    fullNameParts.push('?')
  }

  let fullName = fullNameParts.join(' ')

  return fullName

}

function addQualifierToNamePartsArray(nameParts, qualifier, insertionIndex) {

  // prefixes go in at a particular point
  if (prefixQualifiers.includes(qualifier)) {
    nameParts.splice(insertionIndex, 0, qualifier)
  }

  //otherwise they go at the end
  else {
    nameParts.push(qualifier)
  }

}

function getDetStringFromScientificName(labelRecord, includeAuthority, addItalics) {

  let detString = labelRecord.scientificName

  let nameParts = detString.split(' ').map(x => x.trim()).filter(x => x)

  // attempting to add italics here
  if (addItalics) {

    // if it's a genus or subgenus we need to know that in order to italicise, otherwise it doesn't get italics unless it's two or more parts and one is lowercase
    if (labelRecord.taxonRank && ['genus', 'subgenus'].includes(labelRecord.taxonRank)) {
      nameParts[0] = '<i>' + nameParts[0] + '</i>'
    }
    else if (nameParts.length > 1 && nameParts.some(x => !notItalics.includes(x) && x == x.toLowerCase())) {
      nameParts[0] = '<i>' + nameParts[0] + '</i>'
      for (let i = 1; i < nameParts.length; i++) {
        if (!notItalics.includes(nameParts[i]) && nameParts[i] == nameParts[i].toLowerCase()) {
          nameParts[i] = '<i>' + nameParts[i] + '</i>'
        }
      }
    }
  }

  if (labelRecord.taxonRank && labelRecord.taxonRank == 'genus' || labelRecord.taxonRank == 'subgenus') {
    if (!nameParts.includes('sp.')) {
      nameParts.push('sp.')
    }
  }

  let questionMark = false
  if (labelRecord.identificationConfidence) {
    if (labelRecord.identificationConfidence.toLowerCase() != 'high') {
      questionMark = true
    }
  }

  if (labelRecord.identificationQualifier && !nameParts.includes(labelRecord.identificationQualifier)) {
    if (prefixQualifiers.includes(labelRecord.identificationQualifier)) {
      // we only add authors if it's a prefix qualifier (otherwise authors are added at the end below)
      if (includeAuthority && labelRecord.scientificNameAuthorship && !nameParts.includes(labelRecord.scientificNameAuthorship)) {
        nameParts.push(labelRecord.scientificNameAuthorship)
      }

      // qualifiers go at the beginning of the name if the name includes ranks
      if (Object.values(infraSpecificRanks).some(x => nameParts.includes(x)) || rankParts.some(x => nameParts.includes(x))) {
        nameParts.unshift(labelRecord.identificationQualifier)
      }
      // otherwise they go before the last epithet
      else {
        let lastEpithetIndex = 0
        for (let i = 1; i < nameParts.length; i++) {
          if (nameParts[i] == nameParts[i].toLowerCase()) {
            lastEpithetIndex = i
          }
        }
        nameParts.splice(lastEpithetIndex, 0, labelRecord.identificationQualifier)
      }
    } else {
      // Suffix qualifiers (non-prefix) go at the very end
      if (includeAuthority && labelRecord.scientificNameAuthorship && !nameParts.includes(labelRecord.scientificNameAuthorship)) {
        nameParts.push(labelRecord.scientificNameAuthorship)
      }
      nameParts.push(labelRecord.identificationQualifier)
    }
  } else {
    // No qualifier: add authority if requested
    if (includeAuthority && !questionMark && nameParts.length > 1 && !nameParts.includes('sp.') && !nameParts.includes(labelRecord.scientificNameAuthorship)) {
      if (labelRecord.scientificNameAuthorship) {
        nameParts.push(labelRecord.scientificNameAuthorship)
      }
    }
  }

  if (questionMark) {
    nameParts.push('?')
  }

  detString = nameParts.join(' ')
  return detString
}
