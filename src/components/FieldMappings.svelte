<script>
  import { getContext, createEventDispatcher } from "svelte";
  import darwinCoreFields from "../lib/dwcFields";
  import mapRecord from "../lib/mapRecord";
  import LabelDetail from "./LabelDetail.svelte";
  import LinkIcon from "./LinkIcon.svelte";
  import getFieldMappings from "../lib/getFieldMappings";

  import langs from "../i18n/lang";

  const dispatch = createEventDispatcher()

  export let record
  let mappedRecord

  const settings = getContext('settings')
  const fieldMappings = getContext('mappings')

  $: if ($settings && record) mappedRecord = mapRecord(record, $fieldMappings)
  $: if ($fieldMappings && record) mappedRecord = mapRecord(record, $fieldMappings)

  const refreshMappings = _ => {
    $fieldMappings = {}
    localStorage.removeItem('fieldMappings')
    $fieldMappings = getFieldMappings(record)
    dispatch('mappings-refreshed')
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
<div style="display: flex; width: 100%; flex-wrap: wrap;">
  {#each Object.keys($fieldMappings) as labelField}
  {#if $fieldMappings[labelField]}
  <label style="margin: auto; color: grey;">
    { darwinCoreFields.includes(labelField) ? 'dwc:' + labelField : labelField}
    <select style="display: inline; color: black;" bind:value={$fieldMappings[labelField]}>
      <option value="">not included</option>
      {#each Object.keys(record) as datasetField}
      <option value={datasetField}>{datasetField}</option>
      {/each}
    </select>
    {#if darwinCoreFields.includes(labelField)}
    <a style="position: relative; top: 6px;" href={"https://dwc.tdwg.org/terms/#dwc:" + labelField} target=”_blank”><LinkIcon /></a>
    {/if}
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
