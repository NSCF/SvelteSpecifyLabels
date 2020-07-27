<script>
import mapRecord from '../mapFunctions/kznHerpsMapFunc.js'
import LabelDetail from './KZNMHerpLabelDetail.svelte'

export let record
export let showInstitution = false
export let collectionName
export let labelPerSpecimen = false
export let detLabel = true
export let includePunch = true

let labelRecord
let makeLabel

$: record, (labelRecord = mapRecord(record),
  makeLabel = (labelRecord.fullLocality || 
  labelRecord.fullCoordsString ||
  labelRecord.collectionDate ||
  labelRecord.recordedBy ||
  labelRecord.occurrenceRemarks)
) //this where all mapping and cleaning takes place 

</script>
{#if makeLabel}
  {#if !labelPerSpecimen}
    <LabelDetail {labelRecord} {showInstitution} {detLabel} {includePunch} {collectionName}/>
  {:else}
    {#each Array(labelRecord.specimenCount || 1) as i}
      <LabelDetail {labelRecord} {showInstitution} {detLabel} {includePunch} {collectionName}/>
    {/each}
  {/if}
{/if}

<!-- ################################# -->
