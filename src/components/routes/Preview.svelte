<script>
  import { getContext } from 'svelte';
  import { pop, replace } from 'svelte-spa-router'
  import Header from '../Header.svelte';
  import SettingsCollective from '../SettingsCollective.svelte'
  import BackButton from '../BackButton.svelte';
  import LabelLayout from '../LabelLayout.svelte'
  import langs from '../../i18n/lang';

  const rawData = getContext('data')
  const labelData = getContext('labelData')
  const settings = getContext('settings')
  const fieldMappings = getContext('mappings')

  if ($labelData.length == 0) {
    replace('/')
  }

  const handleCalcLabels = _ => {
    $labelData = makeLabelData($rawData, $fieldMappings[$settings.type], $settings.useRomanNumeralMonths, $settings.excludeNoCatnums, $settings.showStorage, $settings.includeCollectorInSort)
  }

  const showPrint = _ => {
		localStorage.setItem('labelSettings', JSON.stringify($settings))
    localStorage.setItem('fieldMappings', JSON.stringify($fieldMappings))
		window.print()
	}

  
</script>
<div class="topstuff">
  <Header />
  <div style="display:flex; justify-content:space-between">
    <BackButton />
    <button on:click={showPrint} disabled={!$labelData.length}>{langs['printButton'][$settings.lang]}</button>
  </div>
  <div style="margin-top: 1em;margin-bottom:1em;">
    <SettingsCollective on:calc_labels={handleCalcLabels} />
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