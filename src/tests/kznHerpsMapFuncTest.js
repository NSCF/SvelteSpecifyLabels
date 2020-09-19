

const fs = require('fs-extra');
const path = require('path');
const csv = require('fast-csv');

const mapRecord = require('../functions/kznHerpsMapFunc.js')
let getAuthorities = require('../functions/getTaxonAuthorities.js');

const filePath = String.raw`C:\Users\engelbrechti\Downloads`
const fileName = String.raw`query_results_2020-07-24T12_18_00.233191.csv`

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
      mappedRecords.push(mapRecord(record))
    }
    console.log('fetching authorities')
    await getAuthorities(mappedRecords)
    console.log('all done')
  });