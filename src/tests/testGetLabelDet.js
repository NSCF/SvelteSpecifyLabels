import getFieldMappings from '../lib/getFieldMappings.js'
import mapRecord from '../lib/mapRecord.js'
import getLabelDet from '../lib/getLabelDet.js'
import exampleData from '../exampleData.js'

const example = exampleData[2]
const mappings = getFieldMappings(example)
const mapped = mapRecord(example, mappings)
const labelDet = getLabelDet(mapped, false)
let i = 0