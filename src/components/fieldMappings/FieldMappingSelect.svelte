<script>
  import { createEventDispatcher, getContext } from "svelte";
  import darwinCoreFields from "../../lib/dwcFields";
  import LinkIcon from "../misc/LinkIcon.svelte";

  const dispatch = createEventDispatcher()

  export let record
  export let excludeFromMappings

  let labelFieldToMap = ""
  let mappedDatasetField = ""

  const fieldMappings = getContext('mappings')
  const appSettings = getContext('appSettings')

  const handleAddMapping = _ => {
    if (labelFieldToMap) {
      $fieldMappings[$appSettings.labelType][labelFieldToMap] = mappedDatasetField
      labelFieldToMap = ""
      mappedDatasetField = ""
      dispatch('mapping-change')
    }
  }

</script>

<div class="flex h-[2em] items-center">
  <select class="{!mappedDatasetField ? 'text-[gray]' : ''} m-0 ml-[1em]" bind:value={mappedDatasetField} >
    <option value="">Choose a dataset field</option>
    {#each Object.keys(record).filter(recordField => !Object.values($fieldMappings[$appSettings.labelType]).includes(recordField))  as recordField}
    <option class="text-black" value={recordField}>{recordField}</option>
    {/each}
  </select>
  <select class="{!labelFieldToMap ? 'text-[gray]' : ''} m-0" bind:value={labelFieldToMap}>
    <option value="">Choose a label field</option>
    {#each Object.keys($fieldMappings[$appSettings.labelType]).filter(labelField => !$fieldMappings[$appSettings.labelType][labelField]) as labelField}
    {#if !excludeFromMappings.includes(labelField) }
    <option class="text-black" value={labelField}>{labelField}</option>
    {/if}
    {/each}
  </select>
  {#if darwinCoreFields.includes(labelFieldToMap)}
  <a class="relative top-[4px]" href={"https://dwc.tdwg.org/terms/#dwc:" + labelFieldToMap} target=”_blank”><LinkIcon /></a>
  {/if}
  <button class="ml-[1em]" on:click={handleAddMapping}>Map</button>
</div>