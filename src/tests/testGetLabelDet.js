import getFieldMappings from '../lib/getFieldMappings.js'
import mapRecord from '../lib/mapRecord.js'
import getLabelDet from '../lib/getLabelDet.js'
import exampleData from '../exampleDataPlants.js'

const mappings = getFieldMappings(exampleData[0])

const mapped = mapRecord(exampleData[5], mappings)
const labelDet = getLabelDet(mapped, false, true, true)

for (let i = 0; i < exampleData.length; i++) {
  const mapped = mapRecord(exampleData[i], mappings)
  const labelDet = getLabelDet(mapped, false, true, true)
}