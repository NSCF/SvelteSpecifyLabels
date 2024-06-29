import Papa from 'papaparse'
import mapRecord from './mapRecord.js'

export default function(file) {
  return new Promise((resolve, reject) => {

    Papa.parse(file, { 
      header: true,
      skipEmptyLines: true,
      complete: async results => {

        if (results.errors && results.errors.length) {
          for (const err in results.errors) {
            console.log(err)
          }
          reject('oooppppssss!!!!')
        }

        console.log(`${results.data.length} records in file`)
        const fileData = results.data.map(raw => mapRecord(raw))
        console.log(fileData)
        //sort first on storage location, then catalog number, then collector number
        fileData.sort((a, b) => {
          if (a.storageBox < b.storageBox){
            return -1;
          }
          if ( a.storageBox > b.storageBox ){
            return 1;
          }
          if ( a.storageBox == b.storageBox ){
            if (a.catalogNumber < b.catalogNumber){
              return -1;
            }
            if ( a.catalogNumber > b.catalogNumber ){
              return 1;
            }
            if ( a.catalogNumber == b.catalogNumber ){
              if (a.collectorNumber < b.collectorNumber){
                return -1;
              }
              if ( a.collectorNumber > b.collectorNumber ){
                return 1;
              }
            }
          }
          return 0;
        })
    
        resolve(fileData)
    
      }
    })
  })
} 