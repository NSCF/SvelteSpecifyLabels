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
    labelRecord.labelDetName ||
    labelRecord.canonicalName)

  const settings = getContext('settings')


</script>


{#if makeLabel}
  {#if !$settings.labelsPerCount || ($settings.labelsPerCount && !Number(labelRecord[$settings.labelCountField]))}
    <LabelDetail {labelRecord} />
  {:else}
    {#each Array(labelRecord[$settings.labelCountField]) as i}
      <LabelDetail {labelRecord} />
    {/each}
  {/if}
{:else}
  <span>{labelRecord.catalogNumber}: insufficent data to make label...</span>
{/if}

