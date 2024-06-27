<script>
  import { getContext } from "svelte";
  import LabelDetail from './LabelDetail.svelte'

  export let labelRecord
  export let showInstitution = false
  export let collectionName
  export let detLabel = true
  export let detLabelOnly = false
  export let showStorage = true
  export let includePunch = true
  export let includeTaxonAuthorities = false

  let makeLabel

  // only make a label if we have some data
  $: labelRecord, makeLabel = (labelRecord.fullLocality || 
    labelRecord.fullCoordsString ||
    labelRecord.collectionDate ||
    labelRecord.recordedBy ||
    labelRecord.occurrenceRemarks ||
    labelRecord.labelDetName ||
    labelRecord.canonicalName)

  let labelsPerCount = false
  const labelCountField = getContext('labelCount')
  $: if ($labelCountField && labelRecord && $labelCountField in labelRecord) {
    labelsPerCount = true
  }
  else {
    labelsPerCount = false
  }


</script>


{#if makeLabel}
  {#if !labelsPerCount || (labelsPerCount && Number(labelRecord[$labelCountField]))}
    <LabelDetail {labelRecord} {showInstitution} {detLabel} {detLabelOnly} {showStorage} {includePunch} {collectionName} {includeTaxonAuthorities}/>
  {:else}
    {#each Array(labelRecord[$labelCountField] || 1) as i}
      <LabelDetail {labelRecord} {showInstitution} {detLabel} {detLabelOnly} {showStorage} {includePunch} {collectionName} {includeTaxonAuthorities}/>
    {/each}
  {/if}
{:else}
  <span>{labelRecord.catalogNumber}: insufficent data to make label...</span>
{/if}

<!-- ################################# -->
