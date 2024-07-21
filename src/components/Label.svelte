<script>
  import { getContext } from "svelte";
  import LabelDetail from './labels/GeneralLabel.svelte'
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
  {#if $settings.labelPerSpecimen && labelRecord.specimenCount }
    {#each Array(labelRecord.specimenCount) as i}
      <LabelDetail {labelRecord} />
    {/each}
  {:else}
    <LabelDetail {labelRecord} />
  {/if}
{:else}
  <div>insufficent data to make label...</div>
  <br />
{/if}

