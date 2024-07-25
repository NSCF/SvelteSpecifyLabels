<script>
  import { getContext } from "svelte";
  import { pop } from 'svelte-spa-router'
  import mapRecord from "../../lib/mapRecord";
  import FieldMappingIndividual from "../FieldMappingIndividual.svelte";
  import FieldMappingSelect from "../FieldMappingSelect.svelte";
  import LabelDetail from "../labels/GeneralLabel.svelte";
  import getFieldMappings from "../../lib/getFieldMappings";
  import langs from "../../i18n/lang";

  let mappedRecord

  // deprecated fields
  const excludeFromMappings = ['detByLast', 'detByFirst', 'detByInitials']

  const rawData = getContext('data')
  const settings = getContext('settings')
  const fieldMappings = getContext('mappings')

  $: $settings, mappedRecord = mapRecord($rawData[0], $fieldMappings)
  $: $fieldMappings, mappedRecord = mapRecord($rawData[0], $fieldMappings)

  const refreshMappings = _ => {
    localStorage.removeItem('fieldMappings')
    $fieldMappings = getFieldMappings($rawData[0])
  }

</script>

<h2>{langs['mappings'][$settings.lang]}</h2>
<p style="max-width:1000px;">{langs['mappingHelp'][$settings.lang]}</p>
<div style="display: flex; justify-content:space-between">
  <button id="back-button" on:click={_ => pop()}>{langs['back'][$settings.lang]}</button>
  <button on:click={refreshMappings}>{langs['refreshMappings'][$settings.lang]}</button>
</div>
<div style="width: 100%; display:flex; justify-content:center; margin-bottom:2em; ">
  <div style="width: {$settings.labelWidth}cm">
    <div class="label-preview"  >
      <LabelDetail labelRecord={mappedRecord} />
    </div>
  </div>
</div>
<FieldMappingSelect record={$rawData[0]} {excludeFromMappings} />
<div style="display: flex; width: 100%; flex-wrap: wrap;">
  {#each Object.keys($fieldMappings) as labelField}
  {#if $fieldMappings[labelField] && !excludeFromMappings.includes(labelField)}
  <FieldMappingIndividual record={$rawData[0]} {labelField} lang={$settings.lang} />
  {/if}
  {/each}
</div>

<style>

  .label-preview {
    padding:4px; 
    border:1px solid gray; 
    border-radius: 4px;
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
