<script>
import LabelDetail from './LabelDetail.svelte'

export let labelRecord
export let showInstitution = false
export let collectionName
export let labelPerSpecimen = false
export let detLabel = true
export let detLabelOnly = false
export let showStorage = true
export let includePunch = true
export let includeTaxonAuthorities = false
export let authorities

let makeLabel

$: labelRecord, makeLabel = (labelRecord.fullLocality || 
  labelRecord.fullCoordsString ||
  labelRecord.collectionDate ||
  labelRecord.recordedBy ||
  labelRecord.occurrenceRemarks ||
  labelRecord.labelDetName ||
  labelRecord.canonicalName)

</script>
{#if makeLabel}
  {#if !labelPerSpecimen}
    <LabelDetail {labelRecord} {showInstitution} {detLabel} {detLabelOnly} {showStorage} {includePunch} {includeTaxonAuthorities} {authorities} {collectionName}/>
  {:else}
    {#each Array(labelRecord.specimenCount || 1) as i}
      <LabelDetail {labelRecord} {showInstitution} {detLabel} {detLabelOnly} {showStorage} {includePunch} {includeTaxonAuthorities} {authorities} {collectionName}/>
    {/each}
  {/if}
{:else}
  <span>{labelRecord.catalogNumber}: insufficent data to make label...</span>
{/if}

<!-- ################################# -->
