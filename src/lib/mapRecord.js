import getDateTimeRange from 'friendly-iso-datetime-intervals'
import { fieldsMappings } from "./fieldMappings.js"

//takes a record from the input dataset and returns the object needed by the label
export default function mapRecord(record, useRomanNumeralMonths) {

  let mappedRecord = makeStandardFields(record, fieldsMappings)

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

    if(mappedRecord.stateProvince && mappedRecord['admin1Type']){
      mappedRecord.stateProvince += ' ' + mappedRecord['admin1Type']

      if(mappedRecord.county && mappedRecord['admin2Type']) {
        mappedRecord.county += ' ' + mappedRecord['admin2Type']
      }
    }

    mappedRecord.geography = [mappedRecord.country, mappedRecord.stateProvince, mappedRecord.county].filter(x=>x).map(x => x.trim()).filter(x=>x).join('; ')

  }
  
  if(!mappedRecord.fullCoordsString) {
    let coords = null
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
      try{
        mappedRecord.collectionDate = getDateTimeRange(mappedRecord.collectionStartDate, 
          mappedRecord.collectionEndDate || null, mappedRecord.collectionStartTime || null, mappedRecord.collectionEndTime || null, true, useRomanNumeralMonths)
      }
      catch(err) {
        console.error('error with record', mappedRecord.catalogNumber)
        console.error(err)
      }
    }
  }

  //we want em dashes instead of en dashes
  if (mappedRecord.collectionDate.includes('-')){
    mappedRecord.collectionDate = mappedRecord.collectionDate.replace('-', '–')
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

  if(mappedRecord.eventConditions){
    if(mappedRecord.eventRemarks) {
      mappedRecord.eventRemarks = mappedRecord.eventConditions + '; ' + mappedRecord.eventRemarks
    }
    else {
      mappedRecord.eventRemarks = mappedRecord.eventConditions
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
        const nums = mappedRecord.specimenStageSex.match(/\d+/g)
        if (nums) {
          mappedRecord.specimenCount = nums.reduce((x, y) => x + Number(y), 0)
        }
      }
    }
    else {
      mappedRecord.specimenCount = null
      const nums = mappedRecord.specimenStageSex.match(/\d+/g)
      if (nums && nums.length) {
        mappedRecord.specimenCount = nums.reduce((x, y) => x + Number(y), 0)
      }
    }

    //change M and F to symbols
    mappedRecord.specimenStageSex = mappedRecord.specimenStageSex.replace(/M/g, '♂').replace(/F/g, '♀')
  }

  //det stuff
  if(mappedRecord.acceptedName == mappedRecord.canonicalName){
    mappedRecord.acceptedName = null
  }

  //canonicalname takes precedence
  if (mappedRecord.scientificName && !mappedRecord.canonicalName) {
    if (mappedRecord.scientificNameAuthorship && mappedRecord.scientificName.includes(mappedRecord.scientificNameAuthorship)){
      mappedRecord.canonicalName = mappedRecord.scientificName.replace(mappedRecord.scientificNameAuthorship).trim()
    }
    else {
      mappedRecord.canonicalName = mappedRecord.scientificName
    }
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

  //Add method, refs and remarks together to one value
  if(mappedRecord.identificationMethod) {

    if(mappedRecord.identificationReferences) {
      mappedRecord.identificationMethod += ` (${mappedRecord.identificationReferences})`
    }

    if(mappedRecord.identificationRemarks) {
      mappedRecord.identificationRemarks = [mappedRecord.identificationMethod, mappedRecord.identificationRemarks].join('; ')
    }
    else {
      mappedRecord.identificationRemarks = mappedRecord.identificationMethod
    }
  }
  else {
    if(mappedRecord.identificationReferences) {
      mappedRecord.identificationReferences = `From ${mappedRecord.identificationReferences}`
    }

    if(mappedRecord.identificationRemarks) {
      mappedRecord.identificationRemarks = [mappedRecord.identificationReferences, mappedRecord.identificationRemarks].join('; ')
    }
    else {
      mappedRecord.identificationRemarks = mappedRecord.identificationReferences
    }
  }
  
  return mappedRecord

}


//maps the input fields to the standard set of fields we use to generate the label fields
function makeStandardFields(record, fieldsMappings) {
  
  let result = {}

  for (let [field, candidates] of Object.entries(fieldsMappings)) {
    // the field name may be the same in dataset
    result[field] = null
    candidates.unshift(field)
    candidates.unshift(`dwc:${field}`)
    for (let candidate of candidates){
      if (candidate in record) {
        if(record[candidate] != null) {
          if(isNaN(record[candidate])){
            if(typeof record[candidate] == 'boolean' || Array.isArray(record[candidate])){
              result[field] = record[candidate]
              break;
            }
            else if (record[candidate].trim()){
              result[field] = record[candidate].trim()
              break;
            }
          }
          else {
            if(typeof record[candidate] == 'string'){
              result[field] = record[candidate].trim().replace(/\s+/g,' ').replace(/[\.~]+$/,'') //do some cleaning
              break;
            }
            else { //has to be a number
              result[field] = Number(record[candidate])
              break;
            }
          }
        }
      }
    }
  }
  return result
}