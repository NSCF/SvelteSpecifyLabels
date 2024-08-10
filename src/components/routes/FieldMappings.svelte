<script>
  import { onMount, getContext } from "svelte";
  import { push, replace } from 'svelte-spa-router'
  import mapRecord from "../../lib/mapRecord";
  import FieldMappingIndividual from "../FieldMappingIndividual.svelte";
  import FieldMappingSelect from "../FieldMappingSelect.svelte";
  import BackToDesignButton from "../BackToDesignButton.svelte";
  import getFieldMappings from "../../lib/getFieldMappings";
  import langs from "../../i18n/lang";

  const rawData = getContext('data')
  const settings = getContext('settings')
  const fieldMappings = getContext('mappings')

  if (!$fieldMappings || !$rawData.length) {
    replace('/')
  }

  let mappedRecord
  let bottomDiv
  let hideBottomDiv = true
  let dontShowAgain = false

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

  $: $settings, mappedRecord = mapRecord($rawData[0], $fieldMappings[$settings.type])
  $: $fieldMappings[$settings.type], mappedRecord = mapRecord($rawData[0], $fieldMappings[$settings.type])

  const resetMappings = _ => {
    localStorage.removeItem('fieldMappings')
    $fieldMappings[$settings.type] = getFieldMappings($rawData[0])
  }

  const getHideBottomDiv = _ => {
    if (bottomDiv) {
      let gap = window.innerHeight - bottomDiv.getBoundingClientRect().bottom
      hideBottomDiv = gap > 50
    } 
  }

  const scrollBottom = _ => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth' // Optional: Add smooth scrolling effect
    });
    dontShowAgain = true
  }

  

</script>
<svelte:document on:scroll={_ => dontShowAgain = true} />
<h2>{langs['mappings'][$settings.lang]}</h2>
<p style="max-width:1000px;">{langs['mappingHelp'][$settings.lang]}</p>
<div style="display: flex; justify-content:space-between">
  <BackToDesignButton />
  <button on:click={_ => push('/preview')}>{langs['preview'][$settings.lang]}</button>
</div>
<div style="width: 100%; display:flex; justify-content:center; margin-bottom:2em; ">
  <div style="width: {$settings.type == 'herbarium' ? 'fit-content' : $settings.labelWidth + 'cm'}">
    <div class="label-preview" class:preview-border={$settings.type != 'herbarium'}  >
      <svelte:component this = {LabelDetail} labelRecord={mappedRecord} on:label-rendered={getHideBottomDiv} />
    </div>
  </div>
</div>
<div style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:2em;" bind:this={bottomDiv}>
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
<div class:hidden={hideBottomDiv || dontShowAgain} style="position:fixed;bottom:0;width:100%;display:flex;justify-content:center">
  <button class='down-arrow' on:click={scrollBottom}>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
  </button>
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

  .hidden {
    visibility: hidden;
  }

  @keyframes jumpInfinite {
    0% {
      top: 0;
    }
    50% {
      top: -20px;
    }
    100% {
      top: 0;
    }
  }

  .down-arrow {
    position: relative;
    background-color: transparent;
    padding: 0;
    border: none;
    transform: rotate(90deg) scale(2);
    animation: jumpInfinite 2s infinite;
  }
  
</style>
