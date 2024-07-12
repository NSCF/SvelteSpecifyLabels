<script>
  import { getContext, createEventDispatcher } from "svelte";
  import darwinCoreFields from "../lib/dwcFields";
  import mapRecord from "../lib/mapRecord";
  import LabelDetail from "./LabelDetail.svelte";
  import LinkIcon from "./LinkIcon.svelte";
  import CloseIcon from "./CloseIcon.svelte";
  import getFieldMappings from "../lib/getFieldMappings";

  import langs from "../i18n/lang";

  const dispatch = createEventDispatcher()

  export let record
  let mappedRecord

  let labelFieldToMap = ""
  let mappedDatasetField = ""

  const settings = getContext('settings')
  const fieldMappings = getContext('mappings')

  $: if ($settings && record) mappedRecord = mapRecord(record, $fieldMappings)
  $: if ($fieldMappings && record) mappedRecord = mapRecord(record, $fieldMappings)

  const refreshMappings = _ => {
    $fieldMappings = {}
    localStorage.removeItem('fieldMappings')
    $fieldMappings = getFieldMappings(record)
    dispatch('mappings-updated')
  }

  const handleAddMapping = _ => {
    if (labelFieldToMap) {
      console.log('running handleAddMapping')
      $fieldMappings[labelFieldToMap] = mappedDatasetField
      labelFieldToMap = ""
      mappedDatasetField = ""
      dispatch('mappings-updated')
    }

  }
</script>

<h2>{langs[$settings.lang]['mappings']}</h2>
<p>{langs[$settings.lang]['mappingHelp']}</p>
<div style="display: flex; justify-content:space-between">
  <button id="back-button" on:click={_ => dispatch('close-mappings')}>{langs[$settings.lang]['back']}</button>
  <button on:click={refreshMappings}>{langs[$settings.lang]['refreshMappings']}</button>
</div>
<div style="width: 100%; display:flex; justify-content:center; margin-bottom:2em">
  <div class="label-preview" >
    <LabelDetail labelRecord={mappedRecord} />
  </div>
</div>
<div style="display:flex; height:2em; align-items:center; margin-bottom: 2em;">
  <button on:click={handleAddMapping}>Map</button>
  <select class:placeholder-option={!labelFieldToMap} style="margin:0; margin-left:1em;" bind:value={labelFieldToMap}>
    <option value="">Choose a label field</option>
    {#each Object.keys($fieldMappings).filter(labelField => !$fieldMappings[labelField]) as labelField}
    <option style="color: black;" value={labelField}>{labelField}</option>
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
</div>
<div style="display: flex; width: 100%; flex-wrap: wrap;">
  {#each Object.keys($fieldMappings) as labelField}
  {#if $fieldMappings[labelField]}
  <label style="margin: auto; margin-bottom:1em; color: grey; display:flex; align-items:center">
    { darwinCoreFields.includes(labelField) ? 'dwc:' + labelField : labelField}
    {#if darwinCoreFields.includes(labelField)}
    <a style="position: relative; top: 4px;" href={"https://dwc.tdwg.org/terms/#dwc:" + labelField} target=”_blank”><LinkIcon /></a>
    {/if}
    <select style="display: inline; color: black; margin:0; margin-left:1em;" bind:value={$fieldMappings[labelField]}>
      <option value="">{langs[$settings.lang]['remove']}</option>
      {#each Object.keys(record) as datasetField}
      <option value={datasetField}>{datasetField}</option>
      {/each}
    </select>
    <button class="close-button"><CloseIcon/></button>
  </label>
  {/if}
  {/each}
</div>

<style>

  .label-preview {
    width:fit-content; 
    padding:4px; 
    border:1px solid gray; 
    border-radius: 4px;
  }

  .placeholder-option {
    color: gray;
  }

  .close-button {
    margin:0;
    padding: 0;
    background-color: transparent;
    border: none;
    margin-top: 8px;
  }

  a > svg, a {
    fill: #617E3E;
  }

  a:hover > svg *, a:hover {
    fill: #043B58;
  }

  #back-button {
    background-color: LightGray; 
    color: dimgray; 
    border:none;
  }
  #back-button:hover {
    background-color: silver; 
  }
</style>
