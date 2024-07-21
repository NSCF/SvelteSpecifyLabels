<script>
  import { getContext } from "svelte";
  import darwinCoreFields from "../lib/dwcFields";
  import LinkIcon from "./LinkIcon.svelte";

  export let record
  export let excludeFromMappings

  let labelFieldToMap = ""
  let mappedDatasetField = ""

  const fieldMappings = getContext('mappings')

  const handleAddMapping = _ => {
    if (labelFieldToMap) {
      $fieldMappings[labelFieldToMap] = mappedDatasetField
      labelFieldToMap = ""
      mappedDatasetField = ""
    }
  }

</script>

<div style="display:flex; height:2em; align-items:center; margin-bottom: 2em;">
  <select class:placeholder-option={!labelFieldToMap} style="margin:0; " bind:value={labelFieldToMap}>
    <option value="">Choose a label field</option>
    {#each Object.keys($fieldMappings).filter(labelField => !$fieldMappings[labelField]) as labelField}
    {#if !excludeFromMappings.includes(labelField) }
    <option style="color: black;" value={labelField}>{labelField}</option>
    {/if}
    {/each}
  </select>
  {#if darwinCoreFields.includes(labelFieldToMap)}
  <a style="position: relative; top: 4px;" href={"https://dwc.tdwg.org/terms/#dwc:" + labelFieldToMap} target=”_blank”><LinkIcon /></a>
  {/if}
  <select class:placeholder-option={!mappedDatasetField} style="margin:0; margin-left: 1em;" bind:value={mappedDatasetField} >
    <option value="">Choose a dataset field</option>
    {#each Object.keys(record).filter(recordField => !Object.values($fieldMappings).includes(recordField))  as recordField}
    <option style="color: black;" value={recordField}>{recordField}</option>
    {/each}
  </select>
  <button style="margin-left:1em;" on:click={handleAddMapping}>Map</button>
</div>

<style>

  .placeholder-option {
    color: gray;
  }

</style>