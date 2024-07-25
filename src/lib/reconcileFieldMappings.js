export default function reconcileFieldMappings(oldFieldMapping, rawDataRecord) {
  if (Object.keys(oldFieldMapping).length){
    // remove any fields that may not be in the new dataset
    for (const [labelField, mappedDatasetField] of Object.entries(oldFieldMapping)) {
      if (mappedDatasetField && !(mappedDatasetField in rawDataRecord)) {
        oldFieldMapping[labelField] = null
      }
    }
  }
}