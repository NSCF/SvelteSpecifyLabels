

export default function(labelRecord, includeTaxonAuthorities) { 
  //TODO add sensu and other suffixes when we have it

  let labelDet

  if(labelRecord.verbatimIdentification){
    labelDet = labelRecord.verbatimIdentification
    if(!labelDet.includes(' sp.') && !labelDet.includes('?')) {
      if(includeTaxonAuthorities && labelRecord.verbatimIdentification == labelRecord.canonicalName && labelRecord.scientificNameAuthorship) {
        labelDet += ' ' + labelRecord.scientificNameAuthorship
      }
    }
  }
  else {
    if(labelRecord.canonicalName && labelRecord.canonicalName.trim()){
    
      let questionMark = false
      if(labelRecord.identificationConfidence){
        if(labelRecord.identificationConfidence.toLowerCase() != 'high'){
          questionMark = true
        }
      }

      if(labelRecord.identificationQualifier){
        if(['aff.', 'cf.', 'nr'].includes(labelRecord.identificationQualifier)){
          let nameParts = labelRecord.canonicalName.split(' ')
          if(nameParts.length > 1){
            let lastPart = nameParts.pop()
            nameParts.push(labelRecord.identificationQualifier)
            nameParts.push(lastPart)
            if(questionMark){
              nameParts.push('?')
            }
            else if(labelRecord.scientificNameAuthorship && includeTaxonAuthorities && !nameParts.includes('sp.')){
              nameParts.push(labelRecord.scientificNameAuthorship)
            }
            labelDet = nameParts.join(' ')
          }
          else {
            labelDet = [labelRecord.identificationQualifier, labelRecord.canonicalName].join(' ')
            if(questionMark){
              labelDet += ' ?'
            }
            else if (labelRecord.scientificNameAuthorship && includeTaxonAuthorities  && !labelDet.includes(' sp.')){
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
        else if (labelRecord.scientificNameAuthorship && includeTaxonAuthorities && !labelDet.includes(' sp.')){
          labelDet += ` ${labelRecord.scientificNameAuthorship}`
        }
      }
    }
    else {

      labelDet = labelRecord.verbatimIdentification

    }
  }

  return labelDet

}