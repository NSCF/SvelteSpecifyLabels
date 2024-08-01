import getFieldMappings from '../lib/getFieldMappings.js'
import mapRecord from '../lib/mapRecord.js'
import getLabelDet from '../lib/getLabelDet.js'
import exampleData from '../exampleDataPlants.js'

const mappings = getFieldMappings(exampleData[0])

for (let i = 0; i < exampleData.length; i++) {
  const mapped = mapRecord(exampleData[i], mappings)
  const labelDet = getLabelDet(mapped, false, false, true)
}