<script>
  import { onMount, getContext } from "svelte";
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

  const labelComponents = {
    general: async _ => await import('../components/labels/GeneralLabel.svelte'),
    herbarium: async _ => await import('../components/labels/HerbariumLabel.svelte'),
  }

  let LabelDetail 

  const getLabel = async _ => {
    const result = await labelComponents[$settings.type]()
    LabelDetail = result.default
  }

  onMount(getLabel)

  $: $settings.type, getLabel()

  const multipleLabels = _ => {
    return ($settings.type == 'herbarium' && $settings.labelsPerHerbariumSpecimen && labelRecord.specimenCount) || 
      ($settings.type != 'herbarium' && $settings.labelPerSpecimen && labelRecord.specimenCount)
  }

</script>


{#if makeLabel}
  {#if ($settings.labelPerSpecimen || $settings.labelsPerHerbariumSpecimen) && multipleLabels() }
    {#each Array(labelRecord.specimenCount) as i}
      <svelte:component this={LabelDetail} {labelRecord} />
    {/each}
  {:else}
    <svelte:component this={LabelDetail} {labelRecord} />
  {/if}
{:else}
  <div>insufficent data to make label...</div>
  <br />
{/if}

