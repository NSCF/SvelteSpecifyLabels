import mapRecord from './mapRecord.js'

export default function(file) {
  return new Promise((resolve, reject) => {
    
    file.text().then(fileText => {
      const json = JSON.parse(fileText)
      if(json && Array.isArray(json) && json.length){
        data = json.map(x => mapRecord(x))
        resolve(data)
      }
      else {
        console.error(json)
        reject('invalid json file, see console')
      }
    }).catch(err => reject('error parsing JSON: ' + err.message))
  })
}