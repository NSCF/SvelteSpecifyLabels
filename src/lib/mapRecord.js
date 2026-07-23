import getDateTimeRange from 'friendly-iso-datetime-intervals'

function parseAndFormatDate(collectionDate, useRomanNumeralMonths) {
  if (!collectionDate) return collectionDate;

  let str = collectionDate.trim();

  // 1. Try to split by space + time range
  // e.g. "2006/11/12 10:00–10:40" or "2007/01/02 08:00–11:30"
  const spaceSplit = str.split(/\s+/);
  if (spaceSplit.length === 2 && /^\d{2}:\d{2}/.test(spaceSplit[1])) {
    const datePart = spaceSplit[0];
    const timePart = spaceSplit[1];
    const timeParts = timePart.split(/[-–—]/);
    const startTime = timeParts[0] ? timeParts[0].trim() : null;
    const endTime = timeParts[1] ? timeParts[1].trim() : null;
    try {
      return getDateTimeRange(datePart, datePart, startTime, endTime, true, useRomanNumeralMonths);
    } catch (e) {}
  }

  // 2. Try to split by range separators: " - ", " to ", " and ", "–", "—"
  let rangeParts = null;
  const matchRange = str.split(/\s+(?:-|to|and)\s+|\s*[–—]\s*/i);
  if (matchRange.length === 2) {
    rangeParts = matchRange;
  } else {
    // If not matched, check specifically for "2015/07/17-2015/07/19" (slashes in date, hyphen as range separator)
    if (str.includes('-')) {
      const hyphenParts = str.split('-');
      if (hyphenParts.length === 2 && hyphenParts[0].includes('/') && hyphenParts[1].includes('/')) {
        rangeParts = hyphenParts;
      }
    }
    // Check for "2015-07-17/2015-07-19" (hyphens/dots in date, slash as range separator)
    if (!rangeParts && str.includes('/')) {
      const slashParts = str.split('/');
      if (slashParts.length === 2 && !slashParts[0].includes('/') && !slashParts[1].includes('/')) {
        rangeParts = slashParts;
      }
    }
  }

  if (rangeParts) {
    const start = rangeParts[0].trim();
    const end = rangeParts[1].trim();
    try {
      return getDateTimeRange(start, end, null, null, true, useRomanNumeralMonths);
    } catch (e) {}
  }

  // 3. Try to parse directly (single date)
  try {
    return getDateTimeRange(str, null, null, null, true, useRomanNumeralMonths);
  } catch (e) {}

  return collectionDate;
}


//takes a record from the input dataset and returns the object needed by the label
export default function mapRecord(record, fieldMappings, abbreviateCountries, useRomanNumeralMonths, appendGridRefToCoordsString, labelType) {

  let mappedRecord = {}
  for (const [labelfield, recordField] of Object.entries(fieldMappings)) {
    mappedRecord[labelfield] = record[recordField] && record[recordField].trim ? record[recordField].trim() : record[recordField]
  }


  if (mappedRecord.recordNumber) {
    if (!isNaN(mappedRecord.recordNumber)) {
      mappedRecord.recordNumber = Number(mappedRecord.recordNumber)
    }
  }

  if (mappedRecord.geography == null) {

    if (abbreviateCountries) {
      if (/^\s*South\s+Africa\s*$/i.test(mappedRecord.country)) {
        mappedRecord.country = 'RSA'
      }
      if (/congo/i.test(mappedRecord.country) && /democratic/i.test(mappedRecord.country)) {
        mappedRecord.country = 'DRC'
      }
    }

    if (mappedRecord.stateProvince && mappedRecord['admin1Type']) {
      mappedRecord.stateProvince += ' ' + mappedRecord['admin1Type']

      if (mappedRecord.county && mappedRecord['admin2Type']) {
        mappedRecord.county += ' ' + mappedRecord['admin2Type']
      }
    }

    mappedRecord.geography = [mappedRecord.country, mappedRecord.stateProvince, mappedRecord.county].filter(x => x).map(x => x.trim()).filter(x => x).join('; ')

  }

  // handle BRAHMS coordinates
  //TODO check against some real BRAHMS extracts
  if (mappedRecord.verbatimLatitude && mappedRecord.verbatimLongitude && mappedRecord.llunit) {

    if (!mappedRecord.ns || !mappedRecord.ew) {
      mappedRecord.fullCoordsString = 'coords error'
    }
    else {
      mappedRecord.verbatimLatitude = mappedRecord.verbatimLatitude.toString()
      mappedRecord.verbatimLongitude = mappedRecord.verbatimLongitude.toString()

      if (mappedRecord.llunit == 'DD') {
        if (mappedRecord.ns && mappedRecord.ns.toUpperCase() == 'S') {
          mappedRecord.verbatimLatitude = '-' + mappedRecord.verbatimLatitude
        }
        if (mappedRecord.ew && mappedRecord.ew.toUpperCase() == 'W') {
          mappedRecord.verbatimLongitude = '-' + mappedRecord.verbatimLongitude
        }
      }

      if (mappedRecord.llunit == 'DM' || mappedRecord.llunit == 'DMS') {
        mappedRecord.verbatimLatitude = mappedRecord.verbatimLatitude.replace('.', '°')
        mappedRecord.verbatimLongitude = mappedRecord.verbatimLongitude.replace('.', '°')
        const latInsertionIndex = mappedRecord.verbatimLatitude.indexOf('°') + 2
        const longInsertionIndex = mappedRecord.verbatimLongitude.indexOf('°') + 2
        const insertionSymbol = mappedRecord.llunit == 'DM' ? '.' : '\''
        mappedRecord.verbatimLatitude = mappedRecord.verbatimLatitude.slice(0, latInsertionIndex) + insertionSymbol + mappedRecord.verbatimLatitude.slice(latInsertionIndex);
        mappedRecord.verbatimLongitude = mappedRecord.verbatimLongitude.slice(0, longInsertionIndex) + insertionSymbol + mappedRecord.verbatimLongitude.slice(longInsertionIndex);
        const appendSymbol = mappedRecord.llunit == 'DM' ? '\'' : '"'
        mappedRecord.verbatimLatitude += appendSymbol + (mappedRecord.ns ? mappedRecord.ns.toUpperCase() : '')
        mappedRecord.verbatimLongitude += appendSymbol + (mappedRecord.ew ? mappedRecord.ew.toUpperCase() : '')
      }
    }
  }

  if (!mappedRecord.fullCoordsString) {
    let coords = null
    if (mappedRecord.verbatimCoordinates == null) {
      if (mappedRecord.verbatimLatitude && mappedRecord.verbatimLongitude) {
        coords = `${mappedRecord.verbatimLatitude} ${mappedRecord.verbatimLongitude}`
      }
      else if (mappedRecord.decimalLatitude && mappedRecord.decimalLongitude) {
        coords = `${mappedRecord.decimalLatitude} ${mappedRecord.decimalLongitude}`
      }
    }
    else {
      coords = mappedRecord.verbatimCoordinates
    }

    if (coords && mappedRecord.coordsUncertainty != null) {
      if (isNaN(mappedRecord.coordsUncertainty)) {
        if (['m', 'km', 'mi'].some(x => mappedRecord.coordsUncertainty.includes(x))) {
          coords += ' ±' + mappedRecord.coordsUncertainty
        }
        else {
          coords += ' (' + mappedRecord.coordsUncertainty + ')'
        }
      }
      else if (mappedRecord.coordsUncertaintyUnit) {
        let uncertainty = `${mappedRecord.coordsUncertainty}${mappedRecord.coordsUncertaintyUnit}`
        coords = coords + ' ±' + uncertainty
      }
    }

    if (labelType != 'insect' && coords && mappedRecord.coordsSource) {
      coords += `  ${mappedRecord.coordsSource}`
    }

    if (labelType != 'insect' && coords && mappedRecord.verbatimSRS) {
      coords += `  ${mappedRecord.verbatimSRS}`
    }

    mappedRecord.fullCoordsString = coords
  }

  if (mappedRecord.gridReference && appendGridRefToCoordsString) {
    if (mappedRecord.fullCoordsString) {
      mappedRecord.fullCoordsString += ' ' + mappedRecord.gridReference
    }
    else {
      mappedRecord.fullCoordsString = mappedRecord.gridReference
    }
  }

  if (!mappedRecord.labelElevation) {
    if (mappedRecord.verbatimElevation) {
      mappedRecord.labelElevation = mappedRecord.verbatimElevation
    }
    else if (mappedRecord.minElevationMeters != null && mappedRecord.minElevationMeters !== '' || mappedRecord.maxElevationMeters != null && mappedRecord.maxElevationMeters !== '') {
      let elevVals = [mappedRecord.minElevationMeters, mappedRecord.maxElevationMeters].filter(x => x !== null && x !== undefined && x !== '')
      if (elevVals.length == 1) {
        if (isNaN(elevVals[0])) {
          mappedRecord.labelElevation = elevVals[0]
        }
        else {
          mappedRecord.labelElevation = elevVals[0].toString() + 'm'
        }
      }
      else if (mappedRecord.minElevationMeters == mappedRecord.maxElevationMeters) {
        mappedRecord.verbatimElevation = mappedRecord.minElevationMeters + 'm'
        mappedRecord.labelElevation = mappedRecord.verbatimElevation
      }
      else {
        let minElev = Math.min(...elevVals)
        let maxElev = Math.max(...elevVals)
        mappedRecord.verbatimElevation = [minElev, maxElev].join('-') + 'm'
        mappedRecord.labelElevation = mappedRecord.verbatimElevation
      }
    }
    else if (mappedRecord.alt) {
      mappedRecord.labelElevation = mappedRecord.alt.toString()
      if (mappedRecord.altUnit) {
        mappedRecord.labelElevation += mappedRecord.altUnit
      }
      else {
        mappedRecord.labelElevation += 'm'
      }
    }

  }

  if (!mappedRecord.fullLocality) {

    if (mappedRecord.verbatimLocality && !mappedRecord.locality) {
      mappedRecord.locality = mappedRecord.verbatimLocality
    }

    let localityToUse = mappedRecord.locality;
    if (labelType === 'insect' && mappedRecord.labelLocality) {
      localityToUse = mappedRecord.labelLocality;
    }

    if (localityToUse) {
      if (localityToUse.toLowerCase().includes(mappedRecord.geography.toLowerCase())) {
        mappedRecord.fullLocality = localityToUse
      }
      else {
        mappedRecord.fullLocality = [mappedRecord.geography, localityToUse].join('; ')
      }
    }
    else {
      mappedRecord.fullLocality = mappedRecord.geography
    }
  }

  //just some cleaning
  if (mappedRecord.fullLocality) {
    if (mappedRecord.fullLocality.includes(mappedRecord.verbatimElevation)) { //this is happening for altitudes and QDSs
      mappedRecord.fullLocality = mappedRecord.fullLocality.replace(mappedRecord.verbatimElevation, '').trim()
    }
  }

  //we need this so we can break lines on full names
  if (mappedRecord.recordedBy) {

    // we can only fix initials if the user provides appropriate separators
    if (mappedRecord.recordedBy.includes('|') || mappedRecord.recordedBy.includes(';')) {

      mappedRecord.recordedBy = mappedRecord.recordedBy.split(/\s*[;|]\s*/g).filter(x => x).map(x => x.trim()).filter(x => x)

      //we need to transform full names into initials
      let fixed = []
      for (let name of mappedRecord.recordedBy) {
        let parts = name.split(/\s*,\s*/g) //lets hope only two!!
        if (parts[1]) {
          let firstName = parts[1]
          if (!/^[A-Z\s\.]+$/.test(firstName)) { //not initials
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

      for (let i = 0; i < fixed.length - 1; i++) {
        fixed[i] = fixed[i] + ';'
      }

      mappedRecord.recordedBy = fixed
    }
    else {
      mappedRecord.recordedBy = [mappedRecord.recordedBy]
    }

  }

  if (!mappedRecord.collectionDate) {
    if (mappedRecord.collectionStartDate) {
      try {
        mappedRecord.collectionDate = getDateTimeRange(mappedRecord.collectionStartDate,
          mappedRecord.collectionEndDate || null, mappedRecord.collectionStartTime || null, mappedRecord.collectionEndTime || null, true, useRomanNumeralMonths)
      }
      catch (err) {
        console.error('error with record', mappedRecord.catalogNumber)
        console.error(err)
      }
    }
    else {
      let dateParts = []
      if (mappedRecord.year) {
        dateParts.push(mappedRecord.year)
        if (mappedRecord.month) {
          dateParts.push(mappedRecord.month.toString().padStart(2, '0'))
          if (mappedRecord.day) {
            dateParts.push(mappedRecord.day.toString().padStart(2, '0'))
          }
        }
      }
      if (dateParts.length) {
        mappedRecord.collectionDate = dateParts.join('-')
      }
    }
  }

  if (mappedRecord.collectionDate) {
    mappedRecord.collectionDate = parseAndFormatDate(mappedRecord.collectionDate, useRomanNumeralMonths)
  }

  if (!mappedRecord.specimenStageSex) {
    let sexes, stages
    if (mappedRecord.sex) {
      sexes = mappedRecord.sex.split(',').map(x => x.trim()).filter(x => x && x.toLowerCase() != 'unknown').join(' and ')
    }
    if (mappedRecord.lifeStage) {
      stages = mappedRecord.lifeStage.split(',').map(x => {
        let value = x.trim()
        if (value && (value.toLowerCase()) == 'unknown' || value.toLowerCase().startsWith('indet')) {
          return 'stage ' + value
        }
        else {
          return value
        }
      }).filter(x => x).join(' and ')
    }

    if (sexes && stages) {
      mappedRecord.specimenStageSex = `${sexes}, ${stages}`
    }
    else {
      mappedRecord.specimenStageSex = `${sexes || stages || ''}`
    }
  }

  if (mappedRecord.eventConditions) {
    if (mappedRecord.eventRemarks) {
      mappedRecord.eventRemarks = mappedRecord.eventConditions + '; ' + mappedRecord.eventRemarks
    }
    else {
      mappedRecord.eventRemarks = mappedRecord.eventConditions
    }
  }

  if (mappedRecord.occurrenceRemarks) {
    if (mappedRecord.occurrenceRemarks == '-' || mappedRecord.occurrenceRemarks.toLowerCase() == 'no data' || mappedRecord.occurrenceRemarks.toLowerCase() == 'no identification label') {
      mappedRecord.occurrenceRemarks = null
    }
  }

  if (mappedRecord.specimenStageSex != null) {
    if (!isNaN(mappedRecord.specimenCount)) {
      if (Number(mappedRecord.specimenCount) > 0) {
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

  if (!mappedRecord.specimenCount && mappedRecord.dups) {

    if (typeof mappedRecord.dups == 'number' || !isNaN(mappedRecord.dups)) {
      mappedRecord.specimenCount = Number(mappedRecord.dups)
    }
    else if (typeof mappedRecord.dups == 'string') {
      mappedRecord.specimenCount = mappedRecord.dups.split(/[,|;\s]/).filter(x => x).length
    }
  }

  if (labelType === 'insect') {
    if (!mappedRecord.specimenCount || isNaN(mappedRecord.specimenCount) || Number(mappedRecord.specimenCount) < 1) {
      mappedRecord.specimenCount = 1;
    }
  }

  //det stuff
  if (!mappedRecord.dateIdentified) {
    mappedRecord.dateIdentified = null
    const detDateParts = []
    if (mappedRecord.detYear) {
      detDateParts.push(mappedRecord.detYear)
      if (mappedRecord.detMonth) {
        detDateParts.push(mappedRecord.detMonth.padStart(2, '0'))
        if (mappedRecord.detDay) {
          detDateParts.push(mappedRecord.detDay.padStart(2, '0'))
        }
      }
    }
    if (detDateParts.length) {
      mappedRecord.dateIdentified = detDateParts.join('/')
    }
  }

  if (mappedRecord.dateIdentified) {
    try {
      mappedRecord.dateIdentified = getDateTimeRange(mappedRecord.dateIdentified, null, null, null, true, useRomanNumeralMonths)
    }
    catch (err) {
      console.error('error with record identification date', mappedRecord.catalogNumber)
      console.error(err)
    }
  }

  if (!mappedRecord.identifiedBy) {
    mappedRecord.identifiedBy = null
    //TODO Specify has an Initials field as well as middle initial, need to reconcile those
    if (mappedRecord.detByLast) {
      mappedRecord.identifiedBy = mappedRecord.detByLast
      if (mappedRecord.detByFirst) {
        if (/^[A-Z\.\s]+$/.test(mappedRecord.detByFirst)) { //its initials
          mappedRecord.identifiedBy += `, ${Array.from(mappedRecord.detByFirst).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')}`
        }
        else {//its a name
          mappedRecord.identifiedBy += `, ${mappedRecord.detByFirst[0].toUpperCase() + '.'}`
          if (mappedRecord.detByInitials) {
            if (/^[A-Z\.\s]+$/.test(mappedRecord.detByInitials)) { //its initials
              mappedRecord.identifiedBy += Array.from(mappedRecord.detByInitials).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')
            }
            else {//its a name
              mappedRecord.identifiedBy += mappedRecord.detByInitials[0].toUpperCase() + '.'
            }
          }
        }
      }
      else if (mappedRecord.detByInitials) {
        if (/^[A-Z\.\s]+$/.test(mappedRecord.detByInitials)) { //its initials
          mappedRecord.identifiedBy += `, ${Array.from(mappedRecord.detByInitials).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')}`
        }
        else {
          mappedRecord.identifiedBy += mappedRecord.detByInitials[0].toUpperCase() + '.'
        }
      }
    }
    else {
      if (mappedRecord.detByFirst) {
        if (/^[A-Z\.\s]+$/.test(mappedRecord.detByFirst)) { //its initials
          mappedRecord.identifiedBy = Array.from(mappedRecord.detByFirst).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')
        }
        else {//its a name
          mappedRecord.identifiedBy = mappedRecord.detByFirst
          if (mappedRecord.detByInitials) {
            if (/^[A-Z\.\s]+$/.test(mappedRecord.detByInitials)) { //its initials
              mappedRecord.identifiedBy += ` ${Array.from(mappedRecord.detByInitials).filter(x => x && /[a-zA-Z]+/.test(x)).map(x => x.toUpperCase()).join('.')}`
            }
            else {//its a name
              mappedRecord.identifiedBy += ` ${mappedRecord.detByInitials}`
            }
          }
        }
      }
      else if (mappedRecord.detByMiddleInitial) {
        mappedRecord.identifiedBy = mappedRecord.detByMiddleInitial
      }
    }
  }

  //Add method, refs and remarks together to one value
  if (mappedRecord.identificationMethod) {

    if (mappedRecord.identificationReferences) {
      mappedRecord.identificationMethod += ` (${mappedRecord.identificationReferences})`
    }

    if (mappedRecord.identificationRemarks) {
      mappedRecord.identificationRemarks = [mappedRecord.identificationMethod, mappedRecord.identificationRemarks].filter(x => x && x.trim()).join('; ')
    }
    else {
      mappedRecord.identificationRemarks = mappedRecord.identificationMethod
    }
  }
  else {
    if (mappedRecord.identificationReferences) {
      mappedRecord.identificationReferences = `From ${mappedRecord.identificationReferences}`
    }

    if (mappedRecord.identificationRemarks) {
      mappedRecord.identificationRemarks = [mappedRecord.identificationReferences, mappedRecord.identificationRemarks].filter(x => x && x.trim()).join('; ')
    }
    else {
      mappedRecord.identificationRemarks = mappedRecord.identificationReferences
    }
  }

  return mappedRecord

}
