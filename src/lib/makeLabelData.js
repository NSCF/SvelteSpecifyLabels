import sortLabelData from './sortLabelData.js'
import mapRecord from './mapRecord.js'

export default function makeLabelData(rawData, fieldMapping, useRomanNumeralMonths, excludeNoCatnums, sortOnStorage) {

  let labelData = []
  if (rawData.length) {
    
    labelData = rawData.map(raw => mapRecord(raw, fieldMapping, useRomanNumeralMonths))
    
    sortLabelData(labelData, sortOnStorage)

    if (excludeNoCatnums) {
      labelData = labelData.filter(x => x.catalogNumber || x.recordNumber)
    }
  }

  return labelData
}