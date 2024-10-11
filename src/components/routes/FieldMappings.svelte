<script>
  import { onMount, getContext } from "svelte";
  import { push, replace } from 'svelte-spa-router'
  import LabelPreview from "../labels/LabelPreview.svelte";
  import FieldMappingIndividual from "../fieldMappings/FieldMappingIndividual.svelte";
  import FieldMappingSelect from "../fieldMappings/FieldMappingSelect.svelte";
  import BackToDesignButton from "../misc/BackToDesignButton.svelte";
  import getFieldMappings from "../../lib/getFieldMappings";
  import langs from "../../i18n/lang";
  import makeLabelData from '../../lib/makeLabelData'

  const rawData = getContext('data')
  const appSettings = getContext('appSettings')
  const generalLabelSettings = getContext('generalLabelSettings')
  const herbariumLabelSettings = getContext('herbariumLabelSettings')
  const fieldMappings = getContext('mappings')
  const labelData = getContext('labelData')

  const abbreviateCountries = $appSettings.labelType == 'general' || $appSettings.labelType == 'insect'

  let show =  true // this is a bit of a hack because replace is async
  let labelSettings
  let bottomDiv
  let hideBottomDiv = true
  let dontShowAgain = false
  let labelPreviewHeight
  let mainDiv //for getting the width...
  let mainWidth

  // deprecated fields
  const excludeFromMappings = ['detByLast', 'detByFirst', 'detByInitials', 
    'fullLocality', 'fullCoordsString', 'llunit', 'ns', 'ew']

    if ($appSettings.labelType == 'general') {
    labelSettings = generalLabelSettings
  }
  if ($appSettings.labelType == 'herbarium') {
    labelSettings = herbariumLabelSettings
  }

  if ($appSettings.labelType == 'herbarium') {
    if ($labelSettings.labelSize == 'standard') {
      labelPreviewHeight = '11cm'
    }
    else {
      labelPreviewHeight = '14cm'
    }
  }
  else {
    labelPreviewHeight = '10cm'
  }

  // to catch a page refresh
  if (!$fieldMappings || !$rawData.length) {
    show = false
    replace('/')
  }
  else {
    $labelData = makeLabelData($rawData, $fieldMappings[$appSettings.labelType], abbreviateCountries, $labelSettings.useRomanNumeralMonths, $labelSettings.excludeNoCatnums, $labelSettings.showStorage || false, $labelSettings.includeCollectorInSort)
  }

  const resetMappings = _ => {
    $fieldMappings[$appSettings.labelType] = getFieldMappings($rawData[0])
    $labelData = makeLabelData($rawData, $fieldMappings[$appSettings.labelType], abbreviateCountries, $labelSettings.useRomanNumeralMonths, $labelSettings.excludeNoCatnums, $labelSettings.showStorage || false, $labelSettings.includeCollectorInSort)
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

  const handleMappingChange = _ => {
    $labelData = makeLabelData($rawData, $fieldMappings[$appSettings.labelType], abbreviateCountries, $labelSettings.useRomanNumeralMonths, $labelSettings.excludeNoCatnums, $labelSettings.showStorage || false, $labelSettings.includeCollectorInSort)
  }

</script>

<svelte:document on:scroll={_ => dontShowAgain = true} />
<div style="max-width:1280px; margin:auto;" bind:this={mainDiv}>
  {#if show}
    <h2>{langs['mappings'][$appSettings.lang]}</h2>
    <p style="max-width:1000px;">{langs['mappingHelp'][$appSettings.lang]}</p>
    <div style="display: flex; justify-content:space-between">
      <BackToDesignButton />
      <button on:click={_ => push('/preview')}>{langs['preview'][$appSettings.lang]}</button>
    </div>
    <div style="width:{$labelSettings.labelWidth}cm; margin:auto; height: {labelPreviewHeight}">
      <LabelPreview on:label-rendered={getHideBottomDiv} />
    </div>
    <div style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:2em;" bind:this={bottomDiv}>
      <FieldMappingSelect record={$rawData[0]} {excludeFromMappings} on:mapping-change={handleMappingChange} />
      <button class="secondary-button" on:click={resetMappings}>{langs['resetAll'][$appSettings.lang]}</button>
    </div>
    <div style="display: flex; width: 100%; flex-wrap: wrap;">
      {#each Object.keys($fieldMappings[$appSettings.labelType]) as labelField}
        {#if $fieldMappings[$appSettings.labelType][labelField] && !excludeFromMappings.includes(labelField)}
          <FieldMappingIndividual record={$rawData[0]} {labelField} lang={$appSettings.lang} on:mapping-change={handleMappingChange} />
        {/if}
      {/each}
    </div>
    <div class:hidden={hideBottomDiv || dontShowAgain} style="position:fixed;bottom:0; width:{mainDiv ? mainDiv.offsetWidth + 'px' : '100%'}; display:flex; justify-content:center;">
      <button class='down-arrow' on:click={scrollBottom}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
      </button>
    </div>
  {/if}
</div>

<style>

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
