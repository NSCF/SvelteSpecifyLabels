<script>
import { onMount, afterUpdate } from 'svelte';
import KZNMHerpLabel from './KZNMHerpLabel.svelte'

export let showInstitution = false
export let collectionName
export let labelPerSpecimen = false
export let detLabel = true
export let includePunch = true

export let labelData = [
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

let sortingField
let sortedData

$: labelData, sortData()

onMount(_ => {
  sortData()
})
afterUpdate(() => {
  //window.print()
});

const sortData = _ => {
  let sortingFields = [
    'catalogNumber',
    '1.collectionobject.catalogNumber',
    'collectorNumber',
    'collectorNo',
    'recordNumber',
    'fieldNumber',
    'fieldNo',
    '1.collectionobject.fieldNumber',
  ]

  for (let field of sortingFields) {
    if(labelData[0].hasOwnProperty(field)){
      sortingField = field
      break
    }
  }
  let compare = makeComparer(sortingField)
  sortedData = labelData.sort(compare)
}

const makeComparer = field => {
  return function(a, b){
    if (a[field] < b[field]){
      return -1;
    }
    if ( a[field] > b[field] ){
      return 1;
    }
    return 0;
  }
}

</script>

<!-- ################################# -->
<div class="cols"> 
  {#each sortedData as r}
    <KZNMHerpLabel record={r} labelPerSpecimen={labelPerSpecimen} {showInstitution} {detLabel} {includePunch} {collectionName}/>
  {/each}
</div>

<!-- ################################# -->
<style>
.cols {
  column-width: 5cm;
  column-gap: 0.1em;
  break-before: column;
}




</style>