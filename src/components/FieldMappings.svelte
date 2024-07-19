<script>
  import { getContext, createEventDispatcher } from "svelte";

  import mapRecord from "../lib/mapRecord";
  import FieldMappingIndividual from "./FieldMappingIndividual.svelte";
  import FieldMappingSelect from "./FieldMappingSelect.svelte";
  import LabelDetail from "./LabelDetail.svelte";

  import getFieldMappings from "../lib/getFieldMappings";

  import langs from "../i18n/lang";

  const dispatch = createEventDispatcher()

  export let record
  let mappedRecord

  // basically deprecated fields
  const excludeFromMappings = ['detByLast', 'detByFirst', 'detByInitials']

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
<FieldMappingSelect {record} {excludeFromMappings} />
<div style="display: flex; width: 100%; flex-wrap: wrap;">
  {#each Object.keys($fieldMappings) as labelField}
  {#if $fieldMappings[labelField] && !excludeFromMappings.includes(labelField)}
  <FieldMappingIndividual {record} {labelField} lang={$settings.lang} />
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

  #back-button {
    background-color: LightGray; 
    color: dimgray; 
    border:none;
  }

  #back-button:hover {
    background-color: silver; 
  }
  
</style>
