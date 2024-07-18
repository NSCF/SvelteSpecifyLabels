export default function getLabelDet(labelRecord, includeAuthority, includeInfraspecificRanks, addItalics) { 
  //TODO add sensu and other suffixes when we have it

  let labelDet

  // we prioritize verbatimDet, although we can't have italics
  // we assume that verbatim det will have the qualifiers, etc included, because that's what a verbatim det is
  if(labelRecord.verbatimIdentification) {
    //TODO try to work out if this is a species or genus name, add sp. if needed, etc
    labelDet = labelRecord.verbatimIdentification
    return labelDet
  }

  // otherwise rank fields
  labelDet = getDetStringFromRanks(labelRecord, includeAuthority, includeInfraspecificRanks, addItalics)
  if (labelDet) {
    return labelDet
  }

  //otherwise build it from scientificName
  if (labelRecord.scientificName) {

    labelDet = labelRecord.scientificName

    //let's just simplify things here
    if (labelRecord.scientificNameAuthorship && labelDet.includes(labelRecord.scientificNameAuthorship)) {
      labelDet = labelDet.replace(labelRecord.scientificNameAuthorship).trim()
    }

    let nameParts = labelDet.split(' ').map(x => x.trim()).filter(x => x)

    // labelDet might include the author, so let's assume authors will always have a capital letter somewhere, and that we only have authors for species and below
    let lastEpithetIndex = 0
    for (let i = 1; i < nameParts.length; i++) { //we start after the first name part, which will always be titlecase
      
      if (/^sp\.?$/i.test(nameParts[i])) {
        break
      }
      
      if (nameParts[i] == nameParts[i].toLowerCase()){
        lastEpithetIndex = i
      }
      else { //we might have reached an author name
        if (!nameParts[i].includes('(')){ //it might be a subgenus
          break
        }
      }
    }

    //attempting to add italics here
    if (addItalics) {
      for (let i = 0; i <= lastEpithetIndex; i++) {
        nameParts[i] = '<i>' + nameParts[i] + '</i>'
      }
    }

    if(labelRecord.identificationQualifier) {
      addQualifierToNamePartsArray(nameParts, labelRecord.identificationQualifier, lastEpithetIndex)
      
      //we only have scientificname if it's a prefix qualifier
      if(includeAuthority && labelRecord.scientificNameAuthorship && ['aff.', 'cf.', 'nr'].includes(labelRecord.identificationQualifier)) {
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

    //we only want the author if we don't have suffixes or question marks
    // remember authors for dets with prefix qualifiers are already added above
    if (includeAuthority && !labelRecord.identificationQualifier && !questionMark ) {
      if (labelRecord.scientificNameAuthorship) {
        nameParts.push(labelRecord.scientificNameAuthorship)
      }
    }

    if (questionMark) {
      nameParts.push('?')
    }
    
    labelDet = nameParts.join(' ')
    return labelDet

  }

  return null

}

const infraSpecificRanks = {
  subspecies: 'subsp.',
  variety: 'var.',
  form: 'f.'
}

export function getDetStringFromRanks(record, includeAuthority, includeInfraspecificRanks, makeItalics) {
  //we need to walk up from the bottom and collect the necessary values
  const fields = ['order', 'superfamily', 'family', 'tribe', 'subtribe', 'genus', 'species', 'subspecies', 'variety', 'form']
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
    if(includeAuthority && record.scientificNameAuthorship && ['aff.', 'cf.', 'nr'].includes(record.identificationQualifier)) {
      fullNameParts.push(record.scientificNameAuthorship)
    }
  }
  else if (taxonRank == 'genus' || taxonRank == 'subgenus') {
    fullNameParts.push('sp.')
  }

  //we only want the author if we don't have qualifiers or question marks
  if (includeAuthority && !record.identificationQualifier && !questionMark ) {
    if (record.scientificNameAuthorship) {
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
  if(['aff.', 'cf.', 'nr'].includes(qualifier)) {
    nameParts.splice(insertionIndex, 0, qualifier)
  }
  //otherwise they go at the end
  else {
    nameParts.push(qualifier)
  }
}