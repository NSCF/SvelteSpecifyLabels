/**
 * 
 * @param {Array} taxonNames The list of taxon names to fetch authorities for
 * @returns Object of name: authority values, with nulls if no authority found
 */
const getAuthorities = async taxonNames => {
  //clean in case...
  taxonNames = taxonNames.filter(x => x).map(x => x.trim()).filter(x => x)
  let noAuthority = []
  let authorities = {}
  for (let name of taxonNames){
    console.log('fetching authority for', name)
    const authority = await getAuthority(name)
    authorities[name] = authority
    if(authority){
      console.log('authority for', name,  'is', authority)
    }
    else {
      console.log('no authority for', name)
      noAuthority.push(name)
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

export default getAuthorities