const mapRecord = record => {

  let catalogNumber
  if(record.catalogNumber && record.catalogNumber.toString().trim()){
    catalogNumber = record.catalogNumber.toString().trim()
  }
  else {
    if (record['1.collectionobject.catalogNumber'] && record['1.collectionobject.catalogNumber'].trim()){
      catalogNumber = record['1.collectionobject.catalogNumber'].trim()
      if(catalogNumber.includes('-zzz')){
        catalogNumber = catalogNumber.replace('-zzz', '-Her')
      }
    }
  }

  let collectorNumber
  if(record.collectorNumber && record.collectorNumber.toString().trim()){
    if(Number(record.collectorNumber) == 0) {
      collectorNumber = null
    }
    else {
      collectorNumber = record.collectorNumber.toString().trim()
    }
  }
  
  let geography = record['1,10,2.locality.text2'] //orig.prov
  if(!geography || !geography.trim()){
    let country = record['1,10,2,3.geography.Country']
    let stateProv = record['1,10,2,3.geography.State']
    
    if (/^\s*South\s+Africa\s*$/i.test(country)){
      country = 'RSA'
    }
    if (/congo/i.test(country) && /democratic/i.test(country)){
      country = 'DRC'
    }

    geography = [country, stateProv].filter(x=>x).map(x => x.trim()).filter(x=>x).join(';')

  }
  
  let fullCoordsString
  if(record.fullCoordsString && record.fullCoordsString.trim()) {
    fullCoordsString = record.fullCoordsString.trim()
  }
  else {
    let coords
    if (record['1,10,2.locality.relationToNamedPlace'] && 
      record['1,10,2.locality.relationToNamedPlace'].trim()){ //being used for verbatim coordinates!!!
        coords = record['1,10,2.locality.relationToNamedPlace'].trim()
    }
    else if(record['1,10,2.locality.lat1text'] && record['1,10,2.locality.lat1text'].trim()
    && record['1,10,2.locality.long1text'] && record['1,10,2.locality.long1text'].trim()){
      coords = `${record['1,10,2.locality.lat1text']}, ${record['1,10,2.locality.long1text']}`
    }
    
    if(record['1,10,2,123-geocoorddetails.geocoorddetail.maxUncertaintyEst'] && 
      record['1,10,2,123-geocoorddetails.geocoorddetail.maxUncertaintyEst'].toString.trim() &&
      record['1,10,2,123-geocoorddetails.geocoorddetail.maxUncertaintyEstUnit'] && 
      record['1,10,2,123-geocoorddetails.geocoorddetail.maxUncertaintyEstUnit'].trim()){
        let uncertainty = record['1,10,2,123-geocoorddetails.geocoorddetail.maxUncertaintyEst'] + record['1,10,2,123-geocoorddetails.geocoorddetail.maxUncertaintyEstUnit']
        coords = coords + '±' + uncertainty
      }
    
    if(coords){
      fullCoordsString = [coords, record['1,10,2.locality.latLongMethod'], record['1,10,2.locality.datum']]
      .filter(item => item && item.toString().trim())
      .join('  ')
    }
  }
  

  let elevationString
  if(record.elevationString && record.elevationString.trim()) {
    elevationString = record.elevationString.trim()
  }
  else {
    if(record['1,10,2.locality.verbatimElevation'] && record['1,10,2.locality.verbatimElevation'].trim()){
      elevationString = record['1,10,2.locality.verbatimElevation'].trim().replace(/\s+/g,'')
    }
    else {
      let minElev = Math.round(record['1,10,2.locality.minElevation'])
      let maxElev = Math.round(record['1,10,2.locality.maxElevation'])
      if (minElev == maxElev && minElev != 0) {
        elevationString = minElev + 'm'
      }
      if (!elevationString && minElev > maxElev){
        elevationString = [maxElev, minElev].join('-') + 'm'
      }
      if (!elevationString && maxElev > minElev){
        elevationString = [minElev,maxElev].join('-') + 'm'
      }
    }
  }
  
  let fullLocality
  if(record.fullLocality && record.fullLocality.trim()) {
    fullLocality = record.fullLocality.trim()
  }
  else {
    let locality = record['1,10,2.locality.localityName']
    if(locality && locality.trim()){
      locality = locality.trim()
      if(locality != '-' && locality.toLowerCase() != 'none') {
        if(locality.toLowerCase().includes(geography.toLowerCase())){
          fullLocality = locality
        }
        else {
          fullLocality = [geography,locality].join(';')
        }
      }
    }
    else {
      fullLocality = geography
    }
  }
  
  //just some cleaning
  if(fullLocality) {
    fullLocality = fullLocality.replace(/\s+/g, ' ') 
    if (fullLocality.includes(elevationString)){ //this is happening for altitudes and QDSs
      fullLocality = fullLocality.replace(elevationString, '').trim()
    }
    fullLocality = fullLocality.replace(/[\.~]+$/, '').trim()
  }

  let collectionDate
  if(record.collectionDate && record.collectionDate.trim()){
    collectionDate = record.collectionDate.trim()
  }
  else if (record['1,10.collectingevent.startDate'] && record['1,10.collectingevent.startDate'].trim()){
    collectionDate = record['1,10.collectingevent.startDate'].trim()
  }
  
  //we need this so we can break lines on full names
  let recordedBy
  if(record.recordedBy && record.recordedBy.trim()){
    recordedBy = record.recordedBy.trim()
  } 
  else {
    if(record['1,10,30-collectors.collectingevent.collectors'] && record['1,10,30-collectors.collectingevent.collectors'].trim()) {
      recordedBy = record['1,10,30-collectors.collectingevent.collectors'].trim()
    }
  }

  //fixing them
  if(recordedBy) {
    recordedBy = recordedBy.split(/\s*[;|]\s*/g).filter(x=>x).map(x=>x.trim()).filter(x=>x)
    //we need to transform full names into initials
    let fixed = []
    for(let name of recordedBy){
      let parts = name.split(/\s*,\s*/g) //lets hope only two!!
      if(parts[1]) {
        let firstName = parts[1]
        if(!/^[A-Z\s\.]+$/.test(firstName)){ //not initials
          let firstNameParts = firstName.split(' ')
          let initials = firstNameParts.map(x => x[0].toUpperCase()).join('.')
          fixed.push(`${parts[0]}, ${initials}`)
        }
        else {
          fixed.push(`${parts[0]}, ${parts[1].replace(/\s+/g, '')}`) //contracts any initials
        }
      }
      else {
        fixed.push(name)
      }
    }
    recordedBy = fixed

    for (let i = 0; i < recordedBy.length -1; i++){
      recordedBy[i] = recordedBy[i] + ';'
    }
  }

  let collectionMethod
  if(record.collectionMethod && record.collectionMethod.trim()){
    collectionMethod = record.collectionMethod.trim()
  }
  else if (record['1,10.collectingevent.method'] && record['1,10.collectingevent.method'].trim()){
    collectionMethod = record['1,10.collectingevent.method'].trim()
  }
  
  let specimenStageSex
  if(record.specimenStageSex && record.specimenStageSex.trim()){
    specimenStageSex = record.specimenStageSex.trim()
  }
  else {
    if(record['1,63-preparations.preparation.text4'] && record['1,63-preparations.preparation.text4'].trim())(
      specimenStageSex = record['1,63-preparations.preparation.text4'].trim() //stageSex
    )
    else {
      let sexes 
      let stages
      if(record['1,63-preparations.preparation.text1'] && record['1,63-preparations.preparation.text1'].trim()){
        sexes = record['1,63-preparations.preparation.text1'].trim()
        sexes = sexes.split(',').map(x=>x.trim()).filter(x=>x && x.toLowerCase() != 'unknown').join(' and ')
      }
      if(record['1,63-preparations.preparation.text2'] && record['1,63-preparations.preparation.text2'].trim()){
        stages = record['1,63-preparations.preparation.text2'].trim()
        stages = stages.split(',').map(x=> {
            let value = x.trim()
            if(value && (value.toLowerCase()) == 'unknown' || value.toLowerCase().startsWith('indet')){
              return 'stage ' + value
            }
            else {
              return value
            }
          }).filter(x=>x).join(' and ')
      }
  
      if(sexes && stages) {
        specimenStageSex = `${sexes}, ${stages}`
      }
      else {
        specimenStageSex = `${sexes || stages || ''}`
      }
    }
  }
  
  let occurrenceRemarks
  if(record.occurrenceRemarks && record.occurrenceRemarks.trim()){
    occurrenceRemarks = record.occurrenceRemarks.trim().replace(/[\.~]+$/, '').trim()
  }
  else {
    if(record['1.collectionobject.remarks'] && record['1.collectionobject.remarks'].trim()){
      occurrenceRemarks = record['1.collectionobject.remarks'].trim().replace(/\s+/g, ' ').replace(/[\.~]+$/, '').trim()
      if(occurrenceRemarks == '-' || occurrenceRemarks.toLowerCase() == 'no data' || occurrenceRemarks.toLowerCase() == 'no identification label'){
        occurrenceRemarks = null
      }
    }  
  }
  
  let specimenCount
  if(record.specimenCount && !isNaN(record.specimenCount) && record.specimenCount > 0) {
    specimenCount = record.specimenCount
  }
  else {
      if(record['1,63-preparations.preparation.countAmt'] && !isNaN(record['1,63-preparations.preparation.countAmt'])){
      specimenCount = Number(record['1,63-preparations.preparation.countAmt'])
    }
    else {
      specimenCount = null
    }
  }

  //det stuff
  let labelDetName
  if(record.labelDetName && record.labelDetName.trim()){
    labelDetName = record.labelDetName.trim()
  }
  else if (record['1,9-determinations,4.taxon.fullName'] && record['1,9-determinations,4.taxon.fullName'].trim()){
    let taxonAuthor
    if(record['1,9-determinations,4.taxon.author'] && record['1,9-determinations,4.taxon.author'].trim()){
      taxonAuthor = record['1,9-determinations,4.taxon.author'].trim()
    }
    
    if(record['1,9-determinations.determination.qualifier'] && record['1,9-determinations.determination.qualifier'].trim()){
      let qualifier = record['1,9-determinations.determination.qualifier'].trim()
      if(['aff.', 'cf.', 'nr'].includes(qualifier)){
        let nameParts = record['1,9-determinations,4.taxon.fullName'].trim().split(' ')
        if(nameParts.length > 1){
          let lastPart = nameParts.pop()
          nameParts.push(qualifier)
          nameParts.push(lastPart)
          if(taxonAuthor){
            nameParts.push(taxonAuthor)
          }
          labelDetName = nameParts.join(' ')
        }
        else {
          labelDetName = [qualifier, nameParts[0]].join(' ')
          if (taxonAuthor){
            labelDetName += ` ${taxonAuthor}`
          }
        }
      }
      else {
        labelDetName = [record['1,9-determinations,4.taxon.fullName'].trim(), qualifier].join(' ')
      } 
    }
    else {
      labelDetName = record['1,9-determinations,4.taxon.fullName'].trim()
      if (taxonAuthor){
        labelDetName += ` ${taxonAuthor}`
      }
    }
  }

  if(labelDetName){
    if(record['1,9-determinations.determination.confidence'] && 
    record['1,9-determinations.determination.confidence'].trim() &&
    record['1,9-determinations.determination.confidence'].trim().toLowerCase() != 'high'){
      labelDetName += '?'
    }
  }

  //TODO we need the author, and possibly also the sensu

  let detMethod
  if(record.detMethod && record.detMethod.trim()){
    detMethod = record.detMethod
  }
  else if(record['1,9-determinations.determination.method'] && record['1,9-determinations.determination.method'].trim()){
    detMethod = record['1,9-determinations.determination.method'].trim()
  }

  let detBy
  if(record.detBy && record.detBy.trim()){
    detBy = record.detBy
  }
  else if(record['1,9-determinations,5-determiner.agent.lastName'] && record['1,9-determinations,5-determiner.agent.lastName'].trim()) {
    let detByLast = record['1,9-determinations,5-determiner.agent.lastName'].trim()
    let detByFirst, detByInitial, allInitials
    if(record['1,9-determinations,5-determiner.agent.firstName'] && record['1,9-determinations,5-determiner.agent.firstName'].trim()){
      detByFirst = record['1,9-determinations,5-determiner.agent.firstName'].trim()
    }
    if(record['1,9-determinations,5-determiner.agent.middleInitial'] && record['1,9-determinations,5-determiner.agent.middleInitial'].trim()){
      detByInitial = record['1,9-determinations,5-determiner.agent.middleInitial'].trim()
    }

    if(/^[A-Z\.\s]+$/.test(detByFirst)){ //its initials
      allInitials = Array.from(detByFirst).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')
      detBy = detByLast + ', ' + allInitials
    }
    else if (detByFirst && !detByInitial){ //its a name
      detBy = detByLast + ', ' + detByFirst[0].toUpperCase() + '.'
    }
    else if(detByFirst && detByInitial){ // we assume initial is middle initial
      allInitials = detByFirst[0].toUpperCase() + detByInitial
      allInitials = Array.from(allInitials).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')
      detBy = detByLast + ', ' + allInitials
    }
  }

  let detDate
  if(record.detDate && record.detDate.trim()) {
    detDate = record.detDate.trim()
  }
  else if(record['1,9-determinations.determination.determinedDate'] && record['1,9-determinations.determination.determinedDate'].trim()) {
    detDate = record['1,9-determinations.determination.determinedDate'].trim()
  }

  //TODO we need the det reference
  
  //we add the field names here in case they exist already
  let returnRecord = {
    catalogNumber,
    collectorNumber,
    labelDetName,
    detBy,
    detDate, 
    detMethod,
    fullLocality,
    labelElevation: elevationString,
    fullCoordsString,
    collectionDate,
    recordedBy,
    collectionMethod,
    specimenCount,
    specimenStageSex,
    occurrenceRemarks
  }

  return returnRecord

}
module.exports = mapRecord