import { fieldsMappings } from './fieldMappingOptions.js'
import darwinCoreFields from './dwcFields.js'

//maps the input fields to the standard set of fields we use to generate the label fields
export default function getFieldMappings(record) {
  
  const mapping = {}
  const cleanedDatasetFields = {}

  for (const recordField of Object.keys(record)) {
    const cleanedRecordField = cleanFieldName(recordField).toLowerCase()
    cleanedDatasetFields[cleanedRecordField] = recordField
  }

  for (let [labelfield, labelFieldCandidates] of Object.entries(fieldsMappings)) {
    const cleanedLabelField = labelfield.toLowerCase()

    //we might have darwin core fields in the dataset prepended with dwc:, we'll assume they're correctly formed if they are
    if (darwinCoreFields.includes(labelfield)) {
      const recordFields = Object.keys(record)
      if (recordFields.includes('dwc:' + labelfield)) {
        const fieldIndex = recordFields.indexOf('dwc:' + labelfield)
        mapping[labelfield] = recordFields[fieldIndex]
        continue
      }
    }

    if (cleanedLabelField in cleanedDatasetFields){
      mapping[labelfield] = cleanedDatasetFields[cleanedLabelField]
      continue
    }
    else {
      for (let candidateField of labelFieldCandidates){
        const cleanedCandidateField = cleanFieldName(candidateField).toLowerCase()
        if (cleanedCandidateField in cleanedDatasetFields) {
          mapping[labelfield] = cleanedDatasetFields[cleanedCandidateField]
          break
        }
      }
    }

    if (labelfield in mapping) {
      continue
    }
    else {
      mapping[labelfield] = null
    }
  }
    
  return mapping
}


function cleanFieldName(fieldName) {
  fieldName = fieldName.replace(/[\.\s\(\)\/\[\]\-'";:_`~]+/g, '')
  return fieldName
}