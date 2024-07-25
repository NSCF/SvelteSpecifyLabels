const infraSpecificRanks = {
  subspecies: 'subsp.',
  variety: 'var.',
  subvariety: 'subvar.',
  form: 'f.',
  subform: 'subf.'
}

//this is used differently to above
const rankParts = ['subsp', 'var', 'subvar', 'f', 'subf']

const prefixQualifiers = ['aff.', 'cf.', 'nr']
const suffixQualifiers = ['sensu lato', 'sensu stricto']

const notItalics = [...Object.values(infraSpecificRanks), ...prefixQualifiers, ...suffixQualifiers]

export default function getLabelDet(labelRecord, includeAuthority, includeInfraspecificRanks, addItalics) { 

  let labelDet

  // we prioritize verbatimDet, although we can't have italics
  // we assume that verbatim det will have the qualifiers, etc included, because that's what a verbatim det is
  if(labelRecord.verbatimIdentification) {

    labelDet = labelRecord.verbatimIdentification

    if (addItalics) {
      const nameParts = labelRecord.verbatimIdentification.split(' ').filter(x => x)
      //we need to know it's genus to italicize it
      if (labelRecord.taxonRank && labelRecord.taxonRank == 'genus') {
        nameParts[0] = '<i>' + nameParts[0] + '</i>'
      }
      else if (nameParts.length > 1 && nameParts[1] == nameParts[1].toLowerCase() && !nameParts[1].includes('sp.')) { //test if it's a species
        for (let i = 0; i < nameParts.length; i++) {
          const namePart = nameParts[i]
          if (notItalics.includes(namePart) || namePart != namePart.toLowerCase() || namePart.includes('sp.') || /['"]+/.test(namePart)) {
            continue
          }
          else {
            nameParts[i] = '<i>' + namePart + '</i>'
          }
        }
      }
      labelDet = nameParts.join(' ')
    }
  }
  else {

    //we prioritize rank fields over scientificName
    labelDet = getDetStringFromRanks(labelRecord, includeAuthority, includeInfraspecificRanks, addItalics)

    if (!labelDet && labelRecord.scientificName) {
      labelDet = getDetStringFromScientificName(labelRecord, includeAuthority, addItalics)
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


function getDetStringFromRanks(record, includeAuthority, includeInfraspecificRanks, makeItalics) {
  //we need to walk up from the bottom and collect the necessary values
  const fields = ['order', 'superfamily', 'family', 'tribe', 'subtribe', 'genus', 'species', 'subspecies', 'variety', 'subvariety', 'forma', 'subforma']
  fields.reverse()

  let taxonRank
  let cat = true
  const fullNameParts = []
  for (let field of fields) {
    if (record[field] && record[field].trim()){
      
      if (!taxonRank) {
        taxonRank = field
      }

      if (makeItalics && cat) {
        fullNameParts.push('<i>' + record[field] + '</i>')
      }
      else {
        fullNameParts.push(record[field])
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

  let questionMark = false
  if(record.identificationConfidence){
    if(record.identificationConfidence.toLowerCase() != 'high') {
      questionMark = true
    }
  }

  if(record.identificationQualifier) {
    addQualifierToNamePartsArray(fullNameParts, record.identificationQualifier, fullNameParts.length - 1)
    
    //we only have author if it's a prefix qualifier
    if(includeAuthority && record.scientificNameAuthorship && prefixQualifiers.includes(record.identificationQualifier)) {
      fullNameParts.push(record.scientificNameAuthorship)
    }
  }
  else if (taxonRank == 'genus' || taxonRank == 'subgenus') {
    fullNameParts.push('sp.')
  }

  //we only want the author if we don't have qualifiers or question marks
  if (includeAuthority && !record.identificationQualifier && !questionMark ) {
    if (record.scientificNameAuthorship && !fullNameParts.includes(record.scientificNameAuthorship)) {
      fullNameParts.push(record.scientificNameAuthorship)
    }
  }

  if (questionMark) {
    fullNameParts.push('?')
  }

  let fullName = fullNameParts.join(' ')

  return fullName

}

function addQualifierToNamePartsArray(nameParts, qualifier, insertionIndex) {
  // prefixes go in at a particular point
  if(prefixQualifiers.includes(qualifier)) {
    nameParts.splice(insertionIndex, 0, qualifier)
  }
  //otherwise they go at the end
  else {
    nameParts.push(qualifier)
  }
}

function getDetStringFromScientificName(labelRecord, includeAuthority, addItalics) {

  let detString = labelRecord.scientificName

  //let's just simplify things here
  if (labelRecord.scientificNameAuthorship && detString.includes(labelRecord.scientificNameAuthorship)) {
    detString = detString.replace(labelRecord.scientificNameAuthorship).trim()
  }

  let nameParts = detString.split(' ').map(x => x.trim()).filter(x => x)

  // might still include the author, so let's assume authors will always have a capital letter somewhere, and that we only have authors for species and below
  let lastEpithetIndex = 0
  for (let i = 1; i < nameParts.length; i++) { //we start after the first name part, which (should) always be titlecase
    
    if (/^sp\.?$/i.test(nameParts[i])) {
      break
    }
    
    if (nameParts[i] == nameParts[i].toLowerCase()){
      lastEpithetIndex = i
    }
    else { //we might have reached an author name
      if (!nameParts[i].includes('(')){ // or it might be a subgenus
        break
      }
    }
  }

  // attempting to add italics here
  if (addItalics) {

    if (nameParts.length == 1) {
      // we need to know if it's a genus in order it italicize
      if (labelRecord.taxonRank && labelRecord.taxonRank == 'genus') {
        nameParts[0] = '<i>' + nameParts[0] + '</i>'
      }
    }
    else {
      //it might be [something] sp., in which case we need taxonRank to know if it's a genus or not
      if (/^sp\.?$/.test(nameParts[lastEpithetIndex])) {
        if (labelRecord.taxonRank && ['genus', 'subgenus'].includes(labelRecord.taxonRank)) {
          // let's iterate because the rank might not be correct
          for (let i = 0; i <= lastEpithetIndex; i++) {
            nameParts[i] = '<i>' + nameParts[i] + '</i>'
          }
        }
      }
      else if (lastEpithetIndex > 0) { // species, subspecies, etc
        for (let i = 0; i <= lastEpithetIndex; i++) {
          if (!isRankPart(nameParts[i])) {
            nameParts[i] = '<i>' + nameParts[i] + '</i>'
          }
        }
      }
      else { //this should only only have two parts, which can be genus subgenus or genus author

      }
    }
  }

  //check whether the previous part is a rank
  if (isRankPart(nameParts[lastEpithetIndex -1])) {
    lastEpithetIndex -= 1
  }

  if(labelRecord.identificationQualifier) {
    addQualifierToNamePartsArray(nameParts, labelRecord.identificationQualifier, lastEpithetIndex)
    
    //we only add authors if it's a prefix qualifier
    if(includeAuthority && labelRecord.scientificNameAuthorship && prefixQualifiers.includes(labelRecord.identificationQualifier)) {
      nameParts.push(labelRecord.scientificNameAuthorship)
    }
  }
  else if (labelRecord.taxonRank && labelRecord.taxonRank == 'genus' || labelRecord.taxonRank == 'subgenus') {
    if (!nameParts.includes('sp.')) {
      nameParts.push('sp.')
    }
  }

  let questionMark = false
  if(labelRecord.identificationConfidence){
    if(labelRecord.identificationConfidence.toLowerCase() != 'high'){
      questionMark = true
    }
  }

  // we only want the author if we don't have suffixes or question marks
  // remember authors for dets with prefix qualifiers are already added above
  if (includeAuthority && !labelRecord.identificationQualifier && !questionMark && !nameParts.includes('sp.') ) {
    if (labelRecord.scientificNameAuthorship) {
      nameParts.push(labelRecord.scientificNameAuthorship)
    }
  }

  if (questionMark) {
    nameParts.push('?')
  }
  
  detString = nameParts.join(' ')
  return detString
}