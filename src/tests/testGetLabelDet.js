import getFieldMappings from '../lib/getFieldMappings.js'
import mapRecord from '../lib/mapRecord.js'
import getLabelDet from '../lib/getLabelDet.js'
import exampleData from '../exampleDataPlants.js'

const mappings = getFieldMappings(exampleData[0])

const mapped = mapRecord(exampleData[5], mappings)
mapped.verbatimIdentification = "Helichrysum cf. cordifolum Burt Davy"
const labelDet = getLabelDet(mapped, false, true, true)
let i = 0