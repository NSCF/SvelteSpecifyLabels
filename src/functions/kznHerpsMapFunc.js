let mapper = record => {

  let mappedRecord = mapRecord(record, fieldsMapping)

  if(mappedRecord.catalogNumber){

    //remove prefixed zeros from number
    let patt = /\d+$/
    let matches = mappedRecord.catalogNumber.match(patt)
    if(matches.length){
      let number = Number(matches[0])
      mappedRecord.catalogNumber = mappedRecord.catalogNumber.replace(matches[0], number.toString())
    }
    
    if(mappedRecord.catalogNumber.includes('-zzz')){
      mappedRecord.catalogNumber = mappedRecord.catalogNumber.replace('-zzz', '-Her')
    }
  }
  else {
    let i = 0
  }
  
  if(mappedRecord.geography == null){
    
    if (/^\s*South\s+Africa\s*$/i.test(mappedRecord.country)){
      mappedRecord.country = 'RSA'
    }
    if (/congo/i.test(mappedRecord.country) && /democratic/i.test(mappedRecord.country)){
      mappedRecord.country = 'DRC'
    }

    mappedRecord.geography = [mappedRecord.country, mappedRecord.stateProvince].filter(x=>x).map(x => x.trim()).filter(x=>x).join('; ')

  }
  
  if(!mappedRecord.fullCoordsString) {
    let coords
    if (mappedRecord.verbatimCoordinates == null) {
      if(mappedRecord.verbatimLatitude && mappedRecord.verbatimLongitude){
        coords = `${mappedRecord.verbatimLatitude} ${mappedRecord.verbatimLongitude}`
      }
      else if(mappedRecord.decimalLatitude && mappedRecord.decimalLongitude) {
        coords = `${mappedRecord.decimalLatitude} ${mappedRecord.decimalLongitude}`
      }
    }
    else {
      coords = mappedRecord.verbatimCoordinates
    }
    
    if(coords && mappedRecord.maxUncertainty != null && mappedRecord.maxUncertaintyUnit) {
      let uncertainty = `${mappedRecord.maxUncertainty}${mappedRecord.maxUncertaintyUnit}`
      coords = coords + '±' + uncertainty
    }
    
    if(coords && mappedRecord.coordsSource){
      coords += `  ${mappedRecord.coordsSource}`
    }

    if(coords && mappedRecord.verbatimSRS){
      coords += `  ${mappedRecord.verbatimSRS}`
    }

    mappedRecord.fullCoordsString = coords
  }

  if (!mappedRecord.labelElevation){
    if(mappedRecord.verbatimElevation) {
      mappedRecord.labelElevation = mappedRecord.verbatimElevation
    }
    else {
      if(mappedRecord.minElevationMeters) {
        if(mappedRecord.maxElevationMeters){
          if(mappedRecord.minElevationMeters == mappedRecord.maxElevationMeters){
            mappedRecord.verbatimElevation = mappedRecord.minElevationMeters + 'm'
          }
          else {
            let elevVals = [Number(mappedRecord.minElevationMeters), Number(mappedRecord.maxElevationMeters)]
            let minElev = Math.min(elevVals)
            let maxElev = Math.max(elevVals)
            mappedRecord.verbatimElevation = [minElev,maxElev].join('-') + 'm'
          }
        }
      }
    }
  }

  if (!mappedRecord.fullLocality) {
    if(mappedRecord.locality){
      if(mappedRecord.locality.toLowerCase().includes(mappedRecord.geography.toLowerCase())) {
        mappedRecord.fullLocality = mappedRecord.locality
      }
      else {
        mappedRecord.fullLocality = [mappedRecord.geography, mappedRecord.locality].join('; ')
      }
    }
    else {
      mappedRecord.fullLocality = mappedRecord.geography
    }
  }
  
  //just some cleaning
  if(mappedRecord.fullLocality) {
    if (mappedRecord.fullLocality.includes(mappedRecord.verbatimElevation)){ //this is happening for altitudes and QDSs
      mappedRecord.fullLocality = mappedRecord.fullLocality.replace(mappedRecord.verbatimElevation, '').trim()
    }
  }

  //we need this so we can break lines on full names
  if(mappedRecord.recordedBy) {
    mappedRecord.recordedBy = mappedRecord.recordedBy.split(/\s*[;|]\s*/g).filter(x=>x).map(x=>x.trim()).filter(x=>x)
    //we need to transform full names into initials
    let fixed = []
    for(let name of mappedRecord.recordedBy){
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

    for (let i = 0; i < fixed.length -1; i++){
      fixed[i] = fixed[i] + ';'
    }
    
    mappedRecord.recordedBy = fixed

  }

  if(!mappedRecord.collectionDate) {
    if(mappedRecord.collectionStartDate) {
      mappedRecord.collectionDate = mappedRecord.collectionStartDate
    }
    //TODO else if we have an end date. None for KZN Museum herps at this point
  }

  if(!mappedRecord.specimenStageSex) {
    let sexes, stages
    if(mappedRecord.sex){
      sexes = mappedRecord.sex.split(',').map(x=>x.trim()).filter(x=>x && x.toLowerCase() != 'unknown').join(' and ')
    }
    if(mappedRecord.lifeStage){
      stages = mappedRecord.lifeStage.split(',').map(x=> {
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
      mappedRecord.specimenStageSex = `${sexes}, ${stages}`
    }
    else {
      mappedRecord.specimenStageSex = `${sexes || stages || ''}`
    }
  }
  
  if(mappedRecord.occurrenceRemarks){
    if(mappedRecord.occurrenceRemarks == '-' || mappedRecord.occurrenceRemarks.toLowerCase() == 'no data' || mappedRecord.occurrenceRemarks.toLowerCase() == 'no identification label'){
      mappedRecord.occurrenceRemarks = null
    }
  }
  
  if(mappedRecord.specimenStageSex != null) {
    if(!isNaN(mappedRecord.specimenCount)){
      if(Number(mappedRecord.specimenCount) > 0){
        mappedRecord.specimenCount = Number(mappedRecord.specimenCount)
      }
      else {
        mappedRecord.specimenCount = null
      }
    }
    else {
      mappedRecord.specimenCount =  null
    }

    //change M and F to symbols
    mappedRecord.specimenStageSex = mappedRecord.specimenStageSex.replace(/M/g, '♂').replace(/F/g, '♀')
  }

  //det stuff
  if(mappedRecord.acceptedName == mappedRecord.canonicalName){
    mappedRecord.acceptedName = null
  }

  if(!mappedRecord.identifiedBy){
    //TODO Specify has an Initials field as well as middle initial, need to reconcile those
    if(mappedRecord.detByLast) {
      mappedRecord.identifiedBy = mappedRecord.detByLast
      if(mappedRecord.detByFirst){
        if(/^[A-Z\.\s]+$/.test(mappedRecord.detByFirst)){ //its initials
          mappedRecord.identifiedBy += `, ${Array.from(mappedRecord.detByFirst).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')}`
        }
        else {//its a name
          mappedRecord.identifiedBy += `, ${mappedRecord.detByFirst[0].toUpperCase() + '.'}`
          if(mappedRecord.detByMiddleInitial) {
            if(/^[A-Z\.\s]+$/.test(mappedRecord.detByMiddleInitial)){ //its initials
              mappedRecord.identifiedBy += Array.from(mappedRecord.detByMiddleInitial).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')
            }
            else {//its a name
              mappedRecord.identifiedBy += mappedRecord.detByMiddleInitial[0].toUpperCase() + '.'
            }
          }
        }
      }
      else if (mappedRecord.detByMiddleInitial){
        if(/^[A-Z\.\s]+$/.test(mappedRecord.detByMiddleInitial)){ //its initials
          mappedRecord.identifiedBy += `, ${Array.from(mappedRecord.detByMiddleInitial).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')}`
        }
        else {
          mappedRecord.identifiedBy += mappedRecord.detByMiddleInitial[0].toUpperCase() + '.'
        }
      }
    }
    else {
      if(mappedRecord.detByFirst){
        if(/^[A-Z\.\s]+$/.test(mappedRecord.detByFirst)){ //its initials
          mappedRecord.identifiedBy = Array.from(mappedRecord.detByFirst).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')
        }
        else {//its a name
          mappedRecord.identifiedBy = mappedRecord.detByFirst
          if(mappedRecord.detByMiddleInitial) {
            if(/^[A-Z\.\s]+$/.test(mappedRecord.detByMiddleInitial)){ //its initials
              mappedRecord.identifiedBy += ` ${Array.from(mappedRecord.detByMiddleInitial).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')}`
            }
            else {//its a name
              mappedRecord.identifiedBy += ` ${mappedRecord.detByMiddleInitial}`
            }
          }
        }
      }
      else if (mappedRecord.detByMiddleInitial){
        mappedRecord.identifiedBy = mappedRecord.detByMiddleInitial
      }
    }
  }

  //TODO we need the det reference
  
  return mappedRecord

}

let fieldsMapping = { //this uses DwC, mostly...
  catalogNumber: ['1.collectionobject.catalogNumber', 'Catalog Number'], 
  collectorNumber:['1.collectionobject.fieldNumber', 'recordNumber', 'Field Number', 'collNum', 'collNo'],
  geography: ['1,10,2.locality.text2', 'Orig. Prov'],
  country: ['1,10,2,3.geography.Country', 'Country'],
  stateProvince: ['1,10,2,3.geography.State', 'Province'],
  locality: ['1,10,2.locality.localityName', 'Locality Name'],
  fullLocality: [],//empty because searches on the key name only
  fullCoordsString: [], //ditto
  verbatimCoordinates: ['1,10,2.locality.relationToNamedPlace', 'Orig. Coord'],
  verbatimLatitude: ['1,10,2.locality.lat1text', 'Lat1text', 'verbatimLat'],
  verbatimLongitude: ['1,10,2.locality.long1text', 'Long1text', 'verbatimLong'],
  decimalLatitude: ['Latitude1', '1,10,2.locality.latitude1', 'ddLat', 'ddlat', 'decimalLat'],
  decimalLongitude:['Longitude1', '1,10,2.locality.longitude1', 'ddLong', 'ddLon', 'decimalLong', 'decimalLon'],
  maxUncertainty: ['1,10,2,123-geocoorddetails.geocoorddetail.maxUncertaintyEst', 'Max Uncertainty Est'],
  maxUncertaintyUnit:['1,10,2,123-geocoorddetails.geocoorddetail.maxUncertaintyEstUnit', 'Max Uncertainty Est Unit'],
  coordsSource: ['1,10,2.locality.latLongMethod', 'Lat/Long Method', 'georeferenceSources', 'georefSource', 'coordsMethod', 'coordsSource'], //because its should not be a georeference!!
  verbatimSRS: ['Datum', '1,10,2.locality.datum'],
  labelElevation: [],
  verbatimElevation: ['1,10,2.locality.verbatimElevation', 'elevation', 'altitude', 'Verbatim Elev.'],
  minElevationMeters:['Min Elevation in meters', '1,10,2.locality.minElevation', 'minElev'],
  maxElevationMeters:['Max Elevation in meters', '1,10,2.locality.maxElevation', 'maxElev'],
  habitat: [], //NOTE we don't have this in the KZN dataset
  collectionDate: ['verbatimEventDate','dateCollected', 'eventDate'],
  collectionStartDate: ['Start Date', '1,10.collectingevent.startDate'],
  collectEndDate: ['End Date', '1,10.collectingevent.endDate'],
  permitNumber: ['permit', 'permitcode', 'permitCode', 'permitnumber'],
  recordedBy: ['Collectors [Aggregated]', '1,10,30-collectors.collectingevent.collectors', 'collector', 'collectors'],
  samplingProtocol: ['collectionMethod', '1,10.collectingevent.method', 'Collecting Information/Method'],
  eventRemarks:[], //TODO add the relevant Specify fields
  specimenStageSex: ['1,63-preparations.preparation.text4', 'Stage Sex Count'],
  sex:['Sex', '1,63-preparations.preparation.text1'],
  lifeStage: ['stage', 'Stage', 'lifestage', '1,63-preparations.preparation.text2'],
  specimenCount:['1,63-preparations.preparation.countAmt', 'Count'],
  occurrenceRemarks: ['Remarks', 'Collection Object Remarks', '1.collectionobject.remarks', 'Collection Object/Remarks'],

  //det stuff
  labelDetName: ['verbatimIdentification'], //can be used for verbatimIdentification, if we have that
  acceptedName: ['1,9-determinations,4-preferredtaxon.taxon.fullName','Preferred Taxon/Full Name', 'acceptedName', 'acceptedNameUsage'],
  canonicalName: ['1,9-determinations,4.taxon.fullName', 'Full Name', 'Taxon/Full Name'], 
  scientificNameAuthorship: ['1,9-determinations,4.taxon.author', 'Author', 'author', 'authority', 'taxonAuthority', 'nameAuthority'],
  identificationQualifier:['Qualifier', '1,9-determinations.determination.qualifier', 'qualifier'],
  identificationConfidence:['1,9-determinations.determination.confidence', 'Confidence'],
  identificationMethod:['1,9-determinations.determination.method', 'Determinations/Method'],
  identifiedBy:['detBy'],
  detByLast: ['Last Name', '1,9-determinations,5-determiner.agent.lastName'],
  detByFirst: ['First Name', '1,9-determinations,5-determiner.agent.firstName'],
  detByMiddleInitial: ['Middle Initial', '1,9-determinations,5-determiner.agent.middleInitial'],
  dateIdentified: ['Determined Date', '1,9-determinations.determination.determinedDate'],
  identificationRemarks: ['1,9-determinations.determination.remarks', 'Determinations/Remarks', 'Determinations Remarks', 'detRemarks', 'detNotes'],

  //type data
  typeStatus: ['Type Status', '1,9-determinations.determination.typeStatusName'], 
  typeNumber: ['Type Number', '1,9-determinations.determination.text1'],

  //storage
  storageBox: ['Box', '1,63-preparations,58.storage.Box']
}

let mapRecord = (record, fieldsMapping) => {
  
  let toReturn = {}

  for (let [field, candidates] of Object.entries(fieldsMapping)) {
    candidates.unshift(field)
    candidates.unshift(`dwc:${field}`)
    for (let candidate of candidates){
      if(record[candidate] != null) {
        if(isNaN(record[candidate])){
          if(typeof record[candidate] == 'boolean'){
            toReturn[field] = record[candidate]
            break;
          }
          else if (record[candidate].trim()){
            toReturn[field] = record[candidate].trim()
            break;
          }
        }
        else {
          if(typeof record[candidate] == 'string'){
            toReturn[field] = record[candidate].trim().replace(/\s+/g,' ').replace(/[\.~]+$/,'')
            break;
          }
          else { //has to be a number
            toReturn[field] = record[candidate]
            break;
          }
        }
      }
    }
    if(!record[field]){
      record[field] = null
    }
  }
  return toReturn
}

module.exports = mapper