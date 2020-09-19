<script>
import LabelDetail from './KZNMHerpLabelDetail.svelte'

export let labelRecord
export let showInstitution = false
export let collectionName
export let labelPerSpecimen = false
export let detLabel = true
export let includePunch = true
export let includeTaxonAuthorities = false
export let authorities

let makeLabel

$: labelRecord, makeLabel = (labelRecord.fullLocality || 
  labelRecord.fullCoordsString ||
  labelRecord.collectionDate ||
  labelRecord.recordedBy ||
  labelRecord.occurrenceRemarks)

</script>
{#if makeLabel}
  {#if !labelPerSpecimen}
    <LabelDetail {labelRecord} {showInstitution} {detLabel} {includePunch} {includeTaxonAuthorities} {authorities} {collectionName}/>
  {:else}
    {#each Array(labelRecord.specimenCount || 1) as i}
      <LabelDetail {labelRecord} {showInstitution} {detLabel} {includePunch} {includeTaxonAuthorities} {authorities} {collectionName}/>
    {/each}
  {/if}
{/if}

<!-- ################################# -->
