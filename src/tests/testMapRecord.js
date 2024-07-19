import fs from 'fs-extra'
import path from 'path'
import csv from 'fast-csv'

import getFieldMappings from '../lib/getFieldMappings.js'
import mapRecord from '../lib/mapRecord.js'

const filePath = String.raw`C:\Users\ianic\Downloads`
const fileName = String.raw`Skukuza_Biological_Reference_Collection_TEST.csv`

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
      const mappedRecord = mapRecord(record, fieldMappings, true)
      mappedRecords.push(mappedRecord)
    }
  });