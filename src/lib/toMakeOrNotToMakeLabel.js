import getLabelDet from './getLabelDet.js'

const makeLabel = (labelRecord, labelSettings) => {
  return labelRecord && (labelRecord.fullLocality || 
  labelRecord.fullCoordsString ||
  labelRecord.collectionDate ||
  labelRecord.recordedBy ||
  labelRecord.occurrenceRemarks || (
    labelSettings.detLabel || labelSettings.detLabelOnly) && (labelRecord.verbatimIdentification || labelRecord.scientificName || getLabelDet(labelRecord)))
} 

export default makeLabel