<script>
  import { getContext } from "svelte";
  import LabelDetail from './LabelDetail.svelte'
  import getLabelDet from "../lib/getLabelDet";

  export let labelRecord

  const makeLabel = _ => {
    return labelRecord && (labelRecord.fullLocality || 
    labelRecord.fullCoordsString ||
    labelRecord.collectionDate ||
    labelRecord.recordedBy ||
    labelRecord.occurrenceRemarks ||
    labelRecord.verbatimIdentification ||
    labelRecord.scientificName ||
    getLabelDet(labelRecord)
  )
  } 

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
  <span>insufficent data to make label...</span>
{/if}

