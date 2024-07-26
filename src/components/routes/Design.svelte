<script>
  import { getContext } from 'svelte'
  import {link, replace} from 'svelte-spa-router'
  import Header from '../Header.svelte';
  import Settings from '../Settings.svelte';
	import LabelLayout from '../LabelLayout.svelte'
  import getFieldMappings from '../../lib/getFieldMappings'
  import reconcileFieldMappings from '../../lib/reconcileFieldMappings'
  import makeLabelData from '../../lib/makeLabelData'
  import defaultSettings from '../../lib/settings'
  import langs from '../../i18n/lang';

  let labelData = []

  const rawData = getContext('data')
  const settings = getContext('settings')
  const fieldMappings = getContext('mappings')

  // back to home if we have no raw data
  if ($rawData.length == 0) {
    replace('/') // we have to go back to the home page and try again...
  }

  if (Object.keys($fieldMappings).length == 0) {
    const savedFieldMappingsJSON = localStorage.getItem("fieldMappings")
    if (savedFieldMappingsJSON) {
      const savedFieldMappings = JSON.parse(savedFieldMappingsJSON)
      reconcileFieldMappings(savedFieldMappings, $rawData[0])
      $fieldMappings = savedFieldMappings
      console.log('got mappings from history')
    }
    else {
      const newFieldMappings = getFieldMappings($rawData[0])
      $fieldMappings = newFieldMappings
      console.log('created new mappings')
    }
  }

  $: $settings, labelData = makeLabelData($rawData, $fieldMappings, $settings.useRomanNumeralMonths, $settings.excludeNoCatnums, $settings.showStorage)
  $: $fieldMappings, labelData = makeLabelData($rawData, $fieldMappings, $settings.useRomanNumeralMonths, $settings.excludeNoCatnums, $settings.showStorage)

  const showPrint = _ => {
		localStorage.setItem('labelSettings', JSON.stringify($settings))
    localStorage.setItem('fieldMappings', JSON.stringify($fieldMappings))
		window.print()
	}

  window.showData = _ => {
		console.log(labelData)
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

</script>
<div class="container">

</div>
<div class="topstuff">
  <Header />
  <Settings />
  <div style="display:flex; justify-content: space-between">
    <div style="display:flex; flex-direction:row;">
      <button class="secondary-button" on:click={reset} >{langs['reset'][$settings.lang]}</button>
      <a href="/mappings" style="margin:0.5rem 0; padding:1rem 2rem" use:link>{langs['mappings'][$settings.lang].toLowerCase()}</a>
    </div>
    <button on:click={showPrint} disabled={!labelData.length}>{langs['printButton'][$settings.lang]}</button>
  </div>
  <hr/>
</div>
<div class="label-section">
  <LabelLayout inputData={labelData} />
</div>

<style>

  .secondary-button {
    background-color: transparent; 
    border: 1px solid transparent; 
    color:grey;
  }

  .secondary-button:hover {
    border: 1px solid gray
  }

  hr {
    margin: 0;
  }

  @media print {    
    .topstuff
    {
      display: none !important;
    }
  }

  @page { 
    marks: crop; 
  }


</style>