import fs from 'fs-extra'
import path from 'path'
import csv from 'fast-csv'

import getFieldMappings from '../lib/getFieldMappings.js'
import mapRecord from '../lib/mapRecord.js'

const filePath = String.raw`C:\devprojects\SvelteSpecifyLabels`
const fileName = String.raw`example.csv`

let data = []

fs.createReadStream(path.join(filePath, fileName))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', record => {
    data.push(record)
  })
  .on('end', async rowCount => {
    console.log(`Parsed ${rowCount} rows`)
    const mappedRecords = []
    const fieldMappings = getFieldMappings(data[0])
    for (let record of data){
      const mappedRecord = mapRecord(record, fieldMappings)
      mappedRecords.push(mappedRecord)
    }
  });