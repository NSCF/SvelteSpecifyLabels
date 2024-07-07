import mapRecord from './mapRecord.js'

export default function(file) {
  return new Promise((resolve, reject) => {
    
    file.text().then(fileText => {
      const json = JSON.parse(fileText)
      if(json && Array.isArray(json) && json.length){
        resolve(json)
      }
      else {

        reject('invalid json file')
      }
    }).catch(err => reject('error parsing JSON: ' + err.message))
  })
}