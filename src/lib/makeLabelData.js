import {sortOnAll} from './sortLabelData.js'
import mapRecord from './mapRecord.js'

export default function makeLabelData(rawData, fieldMappings, abbreviateCountries, useRomanNumeralMonths, excludeNoCatnums, sortOnStorage, sortOnCollectors, labelType) {

  let labelData = []
  if (rawData.length) {
    
    labelData = rawData.map(raw => mapRecord(raw, fieldMappings, abbreviateCountries, useRomanNumeralMonths, false, labelType))
    
    // sortLabelData(labelData, sortOnStorage)
    sortOnAll(labelData, sortOnStorage, sortOnCollectors)

    if (excludeNoCatnums) {
      labelData = labelData.filter(x => x.catalogNumber || x.recordNumber)
    }
  }

  return labelData
}