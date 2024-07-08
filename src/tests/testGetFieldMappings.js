import fs from 'fs-extra'
import path from 'path'
import csv from 'fast-csv'

import getFieldMappings from "../lib/getFieldMappings.js";

const filePath = String.raw`C:\devprojects\SvelteSpecifyLabels`
const fileName = String.raw`example.csv`

let mapping
fs.createReadStream(path.join(filePath, fileName))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', record => {
    mapping = getFieldMappings(record)
    process.exit()
  })
  .on('end', async rowCount => {
    console.log(`Parsed ${rowCount} rows`)
  });