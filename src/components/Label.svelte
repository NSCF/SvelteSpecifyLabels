<script>
  import { onMount, getContext } from "svelte";

  export let labelRecord
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

  const makeLabel = _ => {
    return labelRecord && (labelRecord.fullLocality || 
    labelRecord.fullCoordsString ||
    labelRecord.collectionDate ||
    labelRecord.recordedBy ||
    labelRecord.occurrenceRemarks ||
    labelRecord.verbatimIdentification )
  } 

</script>

{#if makeLabel()}
  <svelte:component this={LabelDetail} {labelRecord} />
{:else}
  <div>insufficent data for label...</div>
  <br />
{/if}

