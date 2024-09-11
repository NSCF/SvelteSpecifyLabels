<!-- Note this always needs to be in a container with label-width set -->
<script>
  import { onMount, getContext } from "svelte";
  import getLabelDet from "../../lib/getLabelDet";

  export let labelRecord
  const appSettings = getContext('appSettings')
  const generalLabelSettings = getContext('generalLabelSettings')
  const herbariumLabelSettings = getContext('herbariumLabelSettings')

  let labelSettings
  if ($appSettings.labelType == 'general') {
    labelSettings = generalLabelSettings
  }
  if ($appSettings.labelType == 'herbarium') {
    labelSettings = herbariumLabelSettings
  }

  const labelComponents = {
    general: async _ => await import('./GeneralLabel.svelte'),
    herbarium: async _ => await import('./HerbariumLabel.svelte'),
  }

  let LabelDetail 

  const getLabel = async _ => {
    const result = await labelComponents[$appSettings.labelType]()
    LabelDetail = result.default
  }

  onMount(getLabel)

  $: $appSettings.labelType, getLabel()

  const makeLabel = _ => {
    console.log('running makeLabel')
    return labelRecord && (labelRecord.fullLocality || 
    labelRecord.fullCoordsString ||
    labelRecord.collectionDate ||
    labelRecord.recordedBy ||
    labelRecord.occurrenceRemarks || (
      $labelSettings.detLabel || $labelSettings.detLabelOnly) && (labelRecord.verbatimIdentification || labelRecord.scientificName || getLabelDet(labelRecord)))
  } 

</script>

{#if makeLabel()}
  <svelte:component this={LabelDetail} {labelRecord} on:label-rendered />
{:else}
  <div>insufficent label data, check the field mappings...</div>
  <br />
{/if}

