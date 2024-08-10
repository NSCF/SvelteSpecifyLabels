<script>
  import { getContext } from 'svelte'
  import { push, link } from 'svelte-spa-router'
  import Header from '../Header.svelte';
  import StartOverButton from '../StartOverButton.svelte';
  import SettingsIndividual from '../SettingsIndividual.svelte';
  import Label from '../Label.svelte';
  import getFieldMappings from '../../lib/getFieldMappings'
  import reconcileFieldMappings from '../../lib/reconcileFieldMappings'
  import makeLabelData from '../../lib/makeLabelData'
  import defaultSettings from '../../lib/settings'
  import langs from '../../i18n/lang';
  import exampleData from '../../exampleData'
  import exampleDataPlants from '../../exampleDataPlants'

  const rawData = getContext('data')
  const settings = getContext('settings')
  const fieldMappings = getContext('mappings')
  const labelData = getContext('labelData')

  let recordIndex = 0
  let labelWidth =  '9cm'

  // back to home if we have no raw data
  if ($rawData.length == 0) {
    if ($settings.type == 'herbarium') {
      $rawData = exampleDataPlants
    }
    else {
      $rawData = exampleData
    }
  }

  if (Object.keys($fieldMappings).length == 0) {
    const savedFieldMappingsJSON = localStorage.getItem("fieldMappings")
    if (savedFieldMappingsJSON) {
      let savedFieldMappings = JSON.parse(savedFieldMappingsJSON)
      if (!savedFieldMappings[$settings.type]) {
        savedFieldMappings = { [$settings.type]: savedFieldMappings}
      }
      reconcileFieldMappings(savedFieldMappings[$settings.type], $rawData[0])
      $fieldMappings = savedFieldMappings
    }
    else {
      const newFieldMappings = getFieldMappings($rawData[0])
      $fieldMappings = { [$settings.type]: newFieldMappings}
    }
  }

  $labelData = makeLabelData($rawData, $fieldMappings[$settings.type], $settings.useRomanNumeralMonths, $settings.excludeNoCatnums, $settings.showStorage, $settings.includeCollectorInSort)
  
  const handleTypeChange = _ => {

    if ($settings.type == 'herbarium') {
      if ($rawData == exampleData) {
        $rawData = exampleDataPlants
      }
    }
    else {
      if ($rawData == exampleDataPlants) {
        $rawData = exampleData
      }
    }

    if (!$fieldMappings[$settings.type]) {
      const newFieldMappings = getFieldMappings($rawData[0])
      $fieldMappings[$settings.type] = newFieldMappings
    }
    else {
      reconcileFieldMappings($fieldMappings[$settings.type], $rawData[0])
    }

    $labelData = makeLabelData($rawData, $fieldMappings[$settings.type], $settings.useRomanNumeralMonths, $settings.excludeNoCatnums, $settings.showStorage, $settings.includeCollectorInSort)

  }

  const handleCalcLabels = _ => {
    $labelData = makeLabelData($rawData, $fieldMappings[$settings.type], $settings.useRomanNumeralMonths, $settings.excludeNoCatnums, $settings.showStorage, $settings.includeCollectorInSort)
  }

  window.showData = _ => {
		console.log($labelData)
	}

  const reset = _ => {
		if (localStorage.getItem("labelSettings") != null) {
			const savedSettings = JSON.parse(localStorage.getItem("labelSettings"))
			for (const [key, val] of Object.entries(savedSettings)) {
				if (key in $settings) {
					$settings[key] = val
				}
        else if (key in defaultSettings) {
          $settings[key] = defaultSettings[key]
        }
			}
		}

	}

  const nextRecord = _ => {
    if (recordIndex < $labelData.length - 1){
      recordIndex++
    }
  }

  const previousRecord = _ => {
    if (recordIndex > 0){
      recordIndex--
    }
  }

  //unfortunately we need this twice, here and in LabelLayout
  const getLabelWidth = _ => {
    if ($settings.type == 'general') {
      return $settings.labelWidth + 'cm'
    }
    else {
      return '9cm'
    }
  }

  $: $settings.type, labelWidth = getLabelWidth()


</script>
<div style="height: 95vh; display: flex; flex-direction: column;--zoom:{$settings.type == 'general' ? $settings.generalLabelZoom : 1 }">
  <Header />
  <div style="width:100%;flex:1 1 0; min-height:0;display:flex;">
    <SettingsIndividual on:calc_labels={handleCalcLabels} on:type-change={handleTypeChange} />
    <div style="width: 50%; display:flex; flex-direction:column;align-items:center;">
      <div style="width: 100%; display:flex; justify-content:flex-end;">
        <!-- <button class="secondary-button" on:click={reset} >{langs['reset'][$settings.lang]}</button> -->
        <a href="/mappings" style="margin:0.5rem 0; padding:1rem 2rem" use:link>{langs['mappings'][$settings.lang]}</a>
      </div>
      <div  style="width: { labelWidth }; flex:1 1 0; min-height:0;display:flex;flex-direction:column;justify-content:center;color:black;">
        <div class="zoom">
          <Label labelRecord={$labelData[recordIndex]} />
        </div>
      </div>
      <div style="position:relative;width:100%;display:flex;justify-content:center;align-items:center;gap:1em">
        <button class="arrow-button" on:click={previousRecord} disabled={recordIndex == 0}><svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 -960 960 960" ><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg></button>
        <span>{recordIndex + 1}</span>
        <button class="arrow-button" on:click={nextRecord} disabled={recordIndex == $labelData.length - 1}><svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 -960 960 960"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg></button>
        {#if $settings.type != 'herbarium'}
        <div style="position:absolute;top:5px;right:5px;display:flex;align-items:center;">
          {#if $settings.generalLabelZoom > 1}
          <span style="margin-bottom: 10px;">X {$settings.generalLabelZoom}</span>
          {/if}
          {#if $settings.generalLabelZoom >= 2.0}
            <button class="arrow-button" on:click={_ => $settings.generalLabelZoom = 1.0}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400ZM280-540v-80h200v80H280Z"/></svg></button>
          {:else}
            <button class="arrow-button" on:click={_ => $settings.generalLabelZoom += .5 }><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-60v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg></button>
          {/if}
        </div>
        {/if}
      </div>
    </div>
  </div>
  <div style="display:flex; justify-content:space-between">
    <StartOverButton />
    <button on:click={_ => push('/preview')}>{langs['preview'][$settings.lang]}</button>
  </div>
  <hr/>
</div>


<style>

  hr {
    margin: 0;
  }

  .arrow-button {
    color: #5f6368;
    padding: 4px;
    background-color: transparent; 
    border: none; 
  } 

  svg path {
    fill: currentColor;
  }

  .arrow-button:disabled {
    color:lightgrey;
  }

  .arrow-button:hover:disabled {
    cursor: auto;
  }

  .zoom {
    transform: scale(var(--zoom));
  }

</style>