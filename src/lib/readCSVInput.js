import Papa from 'papaparse'



export default function(file, encoding = '') {
  return new Promise((resolve, reject) => {

    Papa.parse(file, { 
      header: true,
      encoding,
      skipEmptyLines: true,
      complete: async results => {

        if (results.errors && results.errors.length) {
          for (const err in results.errors) {
            console.log(err)
          }
          reject('oooppppssss!!!!')
        }

        resolve(results.data)
    
      }
    })
  })
} 