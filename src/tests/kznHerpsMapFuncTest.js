

const fs = require('fs-extra');
const path = require('path');
const csv = require('fast-csv');

const mapRecord = require('../mapFunctions/kznHerpsMapFunc.js')

const filePath = String.raw`C:\Users\engelbrechti\Downloads`
const fileName = String.raw`query_results_2020-07-23T06_22_04.343801.csv`

fs.createReadStream(path.join(filePath, fileName))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', record => {
    let mappedRecord = mapRecord(record)
    let i = 0
  })
  .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));