

export default function(labelRecord, includeAuthority, addItalics) { 
  //TODO add sensu and other suffixes when we have it

  let labelDet

  if(labelRecord.verbatimIdentification){
    labelDet = labelRecord.verbatimIdentification
    if(!labelDet.includes(' sp.') && !labelDet.includes('?')) {
      // TODO fix this for when we don't have canonicalName
      if(includeAuthority && labelRecord.verbatimIdentification == labelRecord.canonicalName && labelRecord.scientificNameAuthorship) {
        labelDet += ' ' + labelRecord.scientificNameAuthorship
      }
    }
  }
  else if(labelRecord.canonicalName && labelRecord.canonicalName.trim()){
    
    //TODO add italics
    
    let questionMark = false
    if(labelRecord.identificationConfidence){
      if(labelRecord.identificationConfidence.toLowerCase() != 'high'){
        questionMark = true
      }
    }

    if(labelRecord.identificationQualifier){
      if(['aff.', 'cf.', 'nr'].includes(labelRecord.identificationQualifier)){
        let nameParts = labelRecord.canonicalName.split(' ').filter(x => x.trim()).map(x => x.trim())
        if (addItalics) {

        }
        if(nameParts.length > 1){
          let lastPart = nameParts.pop()
          nameParts.push(labelRecord.identificationQualifier)
          nameParts.push(lastPart)
          if(questionMark){
            nameParts.push('?')
          }
          else if(labelRecord.scientificNameAuthorship && includeAuthority && !nameParts.includes('sp.')){
            nameParts.push(labelRecord.scientificNameAuthorship)
          }
          labelDet = nameParts.join(' ')
        }
        else {
          labelDet = [labelRecord.identificationQualifier, labelRecord.canonicalName].join(' ')
          if(questionMark){
            labelDet += ' ?'
          }
          else if (labelRecord.scientificNameAuthorship && includeAuthority  && !labelDet.includes(' sp.')){
            labelDet += ` ${labelRecord.scientificNameAuthorship}`
          }
        }
      }
      else {
        labelDet = [labelRecord.canonicalName, labelRecord.identificationQualifier].join(' ')
      } 
    }
    else {
      labelDet = labelRecord.canonicalName
      if(questionMark) {
        labelDet += ' ?'
      }
      else if (labelRecord.scientificNameAuthorship && includeAuthority && !labelDet.includes(' sp.')){
        labelDet += ` ${labelRecord.scientificNameAuthorship}`
      }
    }
  }
  else if (labelRecord.scientificName) {
    labelDet = labelRecord.scientificName

    //TODO add qualifier and certainty
    
    if (addItalics) {
      let nameParts = labelDet.split(" ").map(x => x.trim()).filter(x => x)
      if (nameParts.length > 1) {
        labelDet = '<em>' + labelDet + '</em>'
      }
    }
    if (includeAuthority) {
      if (labelRecord.scientificNameAuthorship && !labelRecord.scientificName.includes(labelRecord.scientificNameAuthorship)){
        labelDet += ' ' + labelRecord.scientificNameAuthorship
      }
    }
  }

  return labelDet

}