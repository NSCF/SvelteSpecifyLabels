<script>
  import { getContext } from "svelte";
  import LabelDetail from './LabelDetail.svelte'

  export let labelRecord

  let makeLabel

  // only make a label if we have some data
  $: labelRecord, makeLabel = (labelRecord.fullLocality || 
    labelRecord.fullCoordsString ||
    labelRecord.collectionDate ||
    labelRecord.recordedBy ||
    labelRecord.occurrenceRemarks ||
    labelRecord.verbatimIdentification ||
    labelRecord.canonicalName)

  const settings = getContext('settings')


</script>


{#if makeLabel}
  {#if $settings.labelPerSpecimen && $settings.labelCountField && Number(labelRecord[$settings.labelCountField])}
    {#each Array(labelRecord[$settings.labelCountField]) as i}
      <LabelDetail {labelRecord} />
    {/each}
  {:else}
    <LabelDetail {labelRecord} />
  {/if}
{:else}
  <span>{labelRecord.catalogNumber}: insufficent data to make label...</span>
{/if}

