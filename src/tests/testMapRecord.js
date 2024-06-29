import fs from 'fs-extra'
import path from 'path'
import csv from 'fast-csv'

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
    let mappedRecords = []
    for (let record of data){
      const mappedRecord = mapRecord(record)
      mappedRecords.push(mappedRecord)
    }
  });