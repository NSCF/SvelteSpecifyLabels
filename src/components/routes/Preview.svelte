<script>
  import { getContext } from 'svelte';
  import { pop, replace } from 'svelte-spa-router'
  import makeLabelData from '../../lib/makeLabelData';
  import Header from '../misc/Header.svelte';
  import CollectiveSettings from '../settings/CollectiveSettings.svelte'
  import BackToDesignButton from "../misc/BackToDesignButton.svelte";
  import LabelLayout from '../labels/LabelLayout.svelte'
  import langs from '../../i18n/lang';

  const rawData = getContext('data')
  const labelData = getContext('labelData')
  const appSettings = getContext('appSettings')
  const generalLabelSettings = getContext('generalLabelSettings')
  const herbariumLabelSettings = getContext('herbariumLabelSettings')
  const fieldMappings = getContext('mappings')

  const abbreviateCountries = $appSettings.labelType == 'general' || $appSettings.labelType == 'insect'

  let labelSettings
  if ($appSettings.labelType == 'general') {
    labelSettings = generalLabelSettings
  }
  if ($appSettings.labelType == 'herbarium') {
    labelSettings = herbariumLabelSettings
  }

  if ($labelData.length == 0) {
    replace('/')
  }

  const handleCalcLabels = _ => {
    $labelData = makeLabelData($rawData, $fieldMappings[$appSettings.labelType], abbreviateCountries, $labelSettings.useRomanNumeralMonths, $labelSettings.excludeNoCatnums, $labelSettings.showStorage || false, $labelSettings.includeCollectorInSort)
  }

  const showPrint = _ => {
		localStorage.setItem('appSettings', JSON.stringify($appSettings))
    localStorage.setItem('generalLabelSettings', JSON.stringify($generalLabelSettings))
    localStorage.setItem('herbariumLabelSettings', JSON.stringify($herbariumLabelSettings))
    localStorage.setItem('fieldMappings', JSON.stringify($fieldMappings))
		window.print()
	}

  
</script>
<div class="topstuff">
  <Header />
  <div style="display:flex; justify-content:space-between">
    <BackToDesignButton />
    <button on:click={showPrint} disabled={!$labelData.length}>{langs['printButton'][$appSettings.lang]}</button>
  </div>
  <div style="margin-top: 1em;margin-bottom:1em;">
    <CollectiveSettings on:calc_labels={handleCalcLabels} />
  </div>
</div>
<div class="labels">
  <LabelLayout />
</div>

<style>

  @media print {    
    .topstuff
    {
      display: none !important;
    }

    .labels {
      margin-top: 1em;
    }
  }

  @page { 
    marks: crop; /* tried this but apparently no effect */
  }

</style>