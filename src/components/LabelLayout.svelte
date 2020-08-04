<script>
import { onMount, afterUpdate } from 'svelte';
import KZNMHerpLabel from './KZNMHerpLabel.svelte'
import mapRecord from '../mapFunctions/kznHerpsMapFunc.js'

export let showInstitution = false
export let collectionName
export let labelPerSpecimen = false
export let detLabel = true
export let includePunch = true

export let inputData 

let testData = [
  {
    catalogNumber: 'NMSA-herp-0.1245',
    collectorNumber: 'WC02-2135',
    permitNumber: 'ACEFDSD1021457', 
    fullLocality: 'RSA;Northern Cape;Richtersveld;Tierhoek camp', 
    fullCoordsString: '-32.12454 18.24587±150m WGS84',
    habitat: 'Steep slopes with large granite boulders and course granitic soils',
    collectionDate: '2002-12-24',
    collectionMethod: 'rock flipping',
    recordedBy: 'Conradie, W.',
    count: 4
  },
  {
    catalogNumber: 'NMSA-herp-0.1232',
    fullLocality: 'RSA;Free State;Bloemfontein', 
    fullCoordsString: '28.32S 12.35E',
    collectionDate: '1904',
    recordedBy: 'Power',
  }
]

let catNumField
let boxField
let authorities = {}

let mappedData = []
let okaySort = false
let sortedData

$: inputData, mapData()
$: if(okaySort) sortData()

const mapData = async _ => {
  console.log('starting to map data')
  
  for (let inputRecord of inputData) {
    let mappedRecord = await mapRecord(inputRecord, true, authorities)
    mappedData.push(mappedRecord)
  }
  console.log('data mapping complete')
  okaySort = true
}

const sortData = _ => {
  console.log('sorting', mappedData.length, 'records')
  let sortingFields = ['catalogNumber', '1.collectionobject.catalogNumber', 'Catalog Number']
  let boxFields = ['storageBox', 'Box', '1,63-preparations,58.storage.Box']

  for (let field of sortingFields) {
    if(mappedData[0].hasOwnProperty(field)){
      catNumField = field
      break
    }
  }

  for (let field of boxFields) {
    if(mappedData[0].hasOwnProperty(field)){
      boxField = field
      break
    }
  }

  let compare = makeComparer(boxField, catNumField)
  sortedData = mappedData.sort(compare)
  console.log('sorting data complete')
}

const makeComparer = (boxField, catNumField) => {
  return function(a, b){
    if (a[boxField] < b[boxField]){
      return -1;
    }
    if ( a[boxField] > b[boxField] ){
      return 1;
    }
    if (a[catNumField] < b[catNumField]){
      return -1;
    }
    if ( a[catNumField] > b[catNumField] ){
      return 1;
    }
    return 0;
  }
}



</script>

<!-- ################################# -->
<div class="cols"> 
  {#if sortedData}
    {#each sortedData as labelRecord}
      <KZNMHerpLabel {labelRecord} {labelPerSpecimen} {showInstitution} {detLabel} {includePunch} {collectionName}/>
    {/each}
  {/if}
</div>

<!-- ################################# -->
<style>
.cols {
  column-width: 5cm;
  column-gap: 0.1em;
  break-before: column;
}




</style>