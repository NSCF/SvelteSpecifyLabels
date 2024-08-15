<script>
  import { getContext } from 'svelte'
  import { push, link } from 'svelte-spa-router'
  import Header from '../Header.svelte';
  import StartOverButton from '../StartOverButton.svelte';
  import SettingsIndividual from '../SettingsIndividual.svelte';
  import LabelPreview from '../LabelPreview.svelte';
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

  //keep this in case
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


</script>
<div style="height: 95vh; display: flex; flex-direction: column;align-items:center;">
  <Header />
  <div style="width:100%; max-width:1280px; flex:1 1 0; min-height:0; display:flex;">
    <SettingsIndividual on:calc_labels={handleCalcLabels} on:type-change={handleTypeChange} />
    <div style="width: 50%; display:flex; flex-direction:column;align-items:center;">
      <div style="width: 100%; display:flex; justify-content:flex-end;">
        <!-- <button class="secondary-button" on:click={reset} >{langs['reset'][$settings.lang]}</button> -->
        <a href="/mappings" style="margin:0.5rem 0; padding:1rem 2rem" use:link>{langs['mappings'][$settings.lang]}</a>
      </div>
      <LabelPreview />
    </div>
  </div>
  <div style="width:100%; max-width:1280px;display:flex; justify-content:space-between">
    <StartOverButton />
    <button on:click={_ => push('/preview')}>{langs['preview'][$settings.lang]}</button>
  </div>
  <hr/>
</div>


<style>

  hr {
    margin: 0;
  }

</style>