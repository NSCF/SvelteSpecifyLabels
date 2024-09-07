<script>
  import { getContext } from 'svelte'
  import { push, link } from 'svelte-spa-router'
  import Header from '../misc/Header.svelte';
  import LabelPreview from '../labels/LabelPreview.svelte';
  import GeneralLabelSettings from '../settings/GeneralLabelSettings.svelte';
  import HerbariumLabelSettings from '../settings/HerbariumLabelSettings.svelte';
  import StartOverButton from '../misc/StartOverButton.svelte';
  import getFieldMappings from '../../lib/getFieldMappings'
  import reconcileFieldMappings from '../../lib/reconcileFieldMappings'
  import makeLabelData from '../../lib/makeLabelData'
  import defaultSettings from '../../settings'
  import langs from '../../i18n/lang';
  import exampleData from '../../exampleData'
  import exampleDataPlants from '../../exampleDataPlants'

  const rawData = getContext('data')
  const appSettings = getContext('appSettings')
  const generalLabelSettings = getContext('generalLabelSettings')
  const herbariumLabelSettings = getContext('herbariumLabelSettings')
  const fieldMappings = getContext('mappings')
  const labelData = getContext('labelData')

  let labelSettings
  if ($appSettings.labelType == 'general') {
    labelSettings = generalLabelSettings
  }
  if ($appSettings.labelType == 'herbarium') {
    labelSettings = herbariumLabelSettings
  }

  // back to home if we have no raw data
  if ($rawData.length == 0) {
    if ($appSettings.labelType == 'herbarium') {
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
      if (!savedFieldMappings[$appSettings.labelType]) {
        savedFieldMappings = { [$appSettings.labelType]: savedFieldMappings}
      }
      reconcileFieldMappings(savedFieldMappings[$appSettings.labelType], $rawData[0])
      $fieldMappings = savedFieldMappings
    }
  }

  if (!$fieldMappings[$appSettings.labelType]) {
    $fieldMappings[$appSettings.labelType] = getFieldMappings($rawData[0])
  }

  const abbreviateCountries = $appSettings.labelType == 'general' || $appSettings.labelType == 'insect'
  $labelData = makeLabelData($rawData, $fieldMappings[$appSettings.labelType], abbreviateCountries, $labelSettings.useRomanNumeralMonths, $labelSettings.excludeNoCatnums, $labelSettings.showStorage, $labelSettings.includeCollectorInSort)
  
  const handleTypeChange = _ => {

    if ($appSettings.labelType == 'herbarium') {
      if ($rawData == exampleData) {
        $rawData = exampleDataPlants
      }
    }
    else {
      if ($rawData == exampleDataPlants) {
        $rawData = exampleData
      }
    }

    if (!$fieldMappings[$appSettings.labelType]) {
      const newFieldMappings = getFieldMappings($rawData[0])
      $fieldMappings[$appSettings.labelType] = newFieldMappings
    }
    else {
      reconcileFieldMappings($fieldMappings[$appSettings.labelType], $rawData[0])
    }

    $labelData = makeLabelData($rawData, $fieldMappings[$appSettings.labelType], abbreviateCountries, $labelSettings.useRomanNumeralMonths, $labelSettings.excludeNoCatnums, $labelSettings.showStorage, $labelSettings.includeCollectorInSort)

  }

  const handleCalcLabels = _ => {
    $labelData = makeLabelData($rawData, $fieldMappings[$appSettings.labelType], abbreviateCountries, $labelSettings.useRomanNumeralMonths, $labelSettings.excludeNoCatnums, $labelSettings.showStorage || null, $labelSettings.includeCollectorInSort)
  }

  window.showData = _ => {
		console.log($labelData)
	}

  //keep this in case
  // const reset = _ => {
	// 	if (localStorage.getItem("labelSettings") != null) {
	// 		const savedSettings = JSON.parse(localStorage.getItem("labelSettings"))
	// 		for (const [key, val] of Object.entries(savedSettings)) {
	// 			if (key in $settings) {
	// 				$settings[key] = val
	// 			}
  //       else if (key in defaultSettings) {
  //         $settings[key] = defaultSettings[key]
  //       }
	// 		}
	// 	}
	// }

</script>
<div style="height: 95vh; display: flex; flex-direction: column;align-items:center;">
  <Header />
  <div id="main" style="width:100%; max-width:1280px; flex:1 1 0; min-height:0; display:flex;">
    <div id="settings">
      {#if $appSettings.labelType == 'general'}
        <GeneralLabelSettings />
      {:else if $appSettings.labelType == 'herbarium'}
        <HerbariumLabelSettings />
      {/if}
    </div>
    <div style="width: 100%; display:flex; justify-content:center;">
      <LabelPreview />
    </div>
  </div>
  <div style="width:100%; max-width:1280px;display:flex; justify-content:space-between">
    <div>
      <StartOverButton />
      <button on:click={_ => push('/mappings')}>{langs['mappings'][$appSettings.lang]}</button>
    </div>
    <button on:click={_ => push('/preview')}>{langs['preview'][$appSettings.lang]}</button>
  </div>
  <hr/>
</div>


<style>

  hr {
    margin: 0;
  }

</style>