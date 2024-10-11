<!-- Note this always needs to be in a container with label-width set -->
<script>
  import { onMount, getContext } from "svelte";
  import makeLabel from '../../lib/toMakeOrNotToMakeLabel'

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



</script>

{#if makeLabel(labelRecord, $labelSettings)}
  <svelte:component this={LabelDetail} {labelRecord} on:label-rendered />
{:else}
  <div>insufficent label data for this record</div>
  <br />
{/if}

