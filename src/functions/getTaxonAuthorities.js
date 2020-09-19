const getAuthorities = async records => {
  let authorities = {}
  let noAuthority = []
  for (let record of records){
    let taxonName = record.canonicalName
    if(taxonName){
      let authority = record.scientificNameAuthorship
      if(!authority || !authority.trim()){ //we give preference to authorities from the original source
        if(!authorities[taxonName]) {
          console.log('fetching authority for', taxonName)
          authority = await getAuthority(taxonName)
          if(authority){
            authorities[taxonName] = authority
            console.log('authority for', taxonName,  'is', authority)
          }
          else {
            if(!noAuthority.includes(taxonName)) {
              console.log('no authority for', taxonName)
              noAuthority.push(taxonName)
            }
          }
        }
      }
    }
  }
  console.log('no authorities for', noAuthority.join(', '))
  return authorities
}

const getAuthority = async taxonName => {
  
  //try GBIF first
  let URL = String.raw`https://api.gbif.org/v1/species`
  let encodedTaxonName = encodeURI(taxonName)
  let response = await fetch(`${URL}?name=${encodedTaxonName}`)
  let data = await response.json()

  //majority rules
  let options = {}
  for (let result of data.results){
    if(result.authorship && result.authorship.trim() && !result.synonym){
      if(options[result.authorship.trim()]){
        options[result.authorship.trim()]++
      }
      else {
        options[result.authorship.trim()] = 1
      }
    }
  }

  let maxcount = 0
  let winner
  for (let [key, value] of Object.entries(options)){
    if(value > maxcount){
      winner = key
      maxcount = value
    }
  }

  if(winner){
    return winner
  }
  else {
    //TODO look at other sources
    return null
  }
}

module.exports = getAuthorities