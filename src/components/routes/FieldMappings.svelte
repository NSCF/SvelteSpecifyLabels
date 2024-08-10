<script>
  import { onMount, getContext } from "svelte";
  import { push, replace } from 'svelte-spa-router'
  import mapRecord from "../../lib/mapRecord";
  import FieldMappingIndividual from "../FieldMappingIndividual.svelte";
  import FieldMappingSelect from "../FieldMappingSelect.svelte";
  import BackToDesignButton from "../BackToDesignButton.svelte";
  import getFieldMappings from "../../lib/getFieldMappings";
  import langs from "../../i18n/lang";

  let mappedRecord

  const labelComponents = {
    general: async _ => await import('../labels/GeneralLabel.svelte'),
    herbarium: async _ => await import('../labels/HerbariumLabel.svelte'),
  }

  let LabelDetail 

  const getLabel = async _ => {
    const result = await labelComponents[$settings.type]()
    LabelDetail = result.default
  }

  onMount(getLabel)

  $: $settings.type, getLabel()

  // deprecated fields
  const excludeFromMappings = ['detByLast', 'detByFirst', 'detByInitials', 
  'fullLocality', 'fullCoordsString', 'llunit', 'ns', 'ew', 'detYear', 
  'detMonth', 'detDay', 'year', 'month', 'day']

  const rawData = getContext('data')
  const settings = getContext('settings')
  const fieldMappings = getContext('mappings')

  if (!$fieldMappings) {
    replace('/design')
  }

  $: $settings, mappedRecord = mapRecord($rawData[0], $fieldMappings[$settings.type])
  $: $fieldMappings[$settings.type], mappedRecord = mapRecord($rawData[0], $fieldMappings[$settings.type])

  const resetMappings = _ => {
    localStorage.removeItem('fieldMappings')
    $fieldMappings[$settings.type] = getFieldMappings($rawData[0])
  }

</script>

<h2>{langs['mappings'][$settings.lang]}</h2>
<p style="max-width:1000px;">{langs['mappingHelp'][$settings.lang]}</p>
<div style="display: flex; justify-content:space-between">
  <BackToDesignButton />
  <button on:click={_ => push('/preview')}>{langs['preview'][$settings.lang]}</button>
</div>
<div style="width: 100%; display:flex; justify-content:center; margin-bottom:2em; ">
  <div style="width: {$settings.type == 'herbarium' ? 'fit-content' : $settings.labelWidth + 'cm'}">
    <div class="label-preview" class:preview-border={$settings.type != 'herbarium'}  >
      <svelte:component this = {LabelDetail} labelRecord={mappedRecord} />
    </div>
  </div>
</div>
<div style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:2em;">
  <FieldMappingSelect record={$rawData[0]} {excludeFromMappings} />
  <button class="secondary-button" on:click={resetMappings}>{langs['resetAll'][$settings.lang]}</button>
</div>
<div style="display: flex; width: 100%; flex-wrap: wrap;">
  {#each Object.keys($fieldMappings[$settings.type]) as labelField}
  {#if $fieldMappings[$settings.type][labelField] && !excludeFromMappings.includes(labelField)}
  <FieldMappingIndividual record={$rawData[0]} {labelField} lang={$settings.lang} />
  {/if}
  {/each}
</div>

<style>

  .label-preview {
    color: black;
    padding:4px; 
    border-radius: 4px;
  }

  .preview-border {
    border:1px solid gray; 
  }

  .secondary-button {
    background-color: LightGray; 
    color: dimgray; 
    border:none;
  }

  .secondary-button:hover {
    background-color: silver; 
  }
  
</style>
