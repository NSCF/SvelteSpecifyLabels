<script>
  import {getContext, createEventDispatcher} from 'svelte'
  import NumberInput from './NumberInput.svelte'
  import langs from "../../i18n/lang";
  import numberInputSettings from '../../settings/numberInputSettings';

  const dispatch = createEventDispatcher()

  const appSettings = getContext('appSettings')
  const labelSettings = getContext('generalLabelSettings')

  const fonts = ["Roboto Condensed", "Courier", 'PT Sans Narrow', 'Times New Roman', 'Arial']
	//only include fonts here where we want to give the user an option to choose
	const fontWeights = {
		"Roboto Condensed": [100, 200, 300, 400]
	}

	$: if( !($labelSettings.font in fontWeights) ) $labelSettings.fontWeight = 400

	

</script>
<div style="width: 100%;display:flex; flex-direction:column;">
  <div class="cols">
    <label style="display:inline;">
      <input type="checkbox" bind:checked={$labelSettings.showCollectionName}>
      {langs['addCollName'][$appSettings.lang]}
    </label>
    <br/>
    {#if $labelSettings.showCollectionName}
      <input type="text" bind:value={$labelSettings.collectionName} style="display:inline;padding:10px;height:10px" placeholder={langs['collName'][$appSettings.lang]}><br>
      <br/>
    {/if}
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.detLabel}>
      {langs['dets'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.detLabelOnly}>
      {langs['detsOnly'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.includeStageSexOnMainLabel}>
      {langs['stageSexOnMain'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.includePunch}>
      {langs['punch'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline;break-after:never;">
      <input type="checkbox" bind:checked={$labelSettings.includeQRCode}> <!-- TODO we need this for herbarium label separately -->
      {langs['qrCode'][$appSettings.lang]}
    </label>
    <br/>
    {#if $labelSettings.includeQRCode && $labelSettings.detLabel && !$labelSettings.detLabelOnly}
      <label style="display:inline">
        <input type="checkbox" style="margin-left:2em;" bind:checked={$labelSettings.qrCodeOnDetLabels}>
        {langs['onDetLabels'][$appSettings.lang]}
      </label>
      <br/>
    {/if}
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.showStorage} on:change={_ => dispatch('calc_labels')}>
      {langs['storage'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.includeTaxonAuthorities}> <!-- TODO we need this for herbarium label separately -->
      {langs['authors'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.includeFieldNumber}>
      {langs['fieldNumber'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.includeProject}>
      {langs['project'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.useRomanNumeralMonths} on:change={_ => dispatch('calc_labels')}>
      {langs['romanNums'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.underline}> <!-- TODO we need this for herbarium label separately -->
      {langs['underline'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.italics}> <!-- TODO we need this for herbarium label separately -->
      {langs['italics'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type="checkbox" bind:checked={$labelSettings.addPrintedDate}>
      {langs['printDate'][$appSettings.lang]}
    </label>
    <br/>
    {#if $labelSettings.addPrintedDate}
      <input type="text" bind:value={$labelSettings.printerModel} style="display:inline; margin:0;height:10px" placeholder={langs['printer'][$appSettings.lang]}><br>
      <br/>
    {/if}
  </div>
  <div style="display:flex; gap:5px">
    <div>
      <label for="fonts">{langs['font'][$appSettings.lang]}</label>
      <select id="fonts" bind:value={$labelSettings.font}>
        {#each fonts as font}
        <option value={font}>{font}</option>
        {/each}
      </select>
    </div>
    {#if $labelSettings.font in fontWeights}
    <div>
      <label for="font-weight" style="text-wrap:nowrap">{langs['fontWeight'][$appSettings.lang]}</label>
      <select id="font-weight" bind:value={$labelSettings.fontWeight}>
        {#each fontWeights[$labelSettings.font] as weightOption}
        <option value={weightOption}>{weightOption}</option>
        {/each}
      </select>
    </div>
    {/if}
    <div>
      <NumberInput id="font-size" 
        labelString={langs['fontSize'][$appSettings.lang]} 
        min={numberInputSettings.fontSize.min}
        max={numberInputSettings.fontSize.max} 
        step={numberInputSettings.fontSize.step || 1}
        bind:value={$labelSettings.fontSize}
        />
    </div>
    <div>
      <NumberInput id="line-height"
        labelString={langs['lineHeight'][$appSettings.lang]}
        min={numberInputSettings.lineHeight.min} 
        max={numberInputSettings.lineHeight.max} 
        step={numberInputSettings.lineHeight.step || 1}
        bind:value={$labelSettings.lineHeight}
        />
    </div>
    <div >
      <NumberInput id="label-width"
      labelString={langs['labelWidth'][$appSettings.lang]}
      min={numberInputSettings.labelWidth.min} 
      max={numberInputSettings.labelWidth.max} 
      step={numberInputSettings.labelWidth.step || 1}
      bind:value={$labelSettings.labelWidth}
      unit={langs['labelWidthUnit'][$appSettings.lang]}
      />
    </div>
    {#if $labelSettings.includeQRCode}
      <div>
        <NumberInput id="qrcode-size"
        labelString={langs['qrCodeSize'][$appSettings.lang]}
        min={numberInputSettings.qrCodeDims.min} 
        max={numberInputSettings.qrCodeDims.max} 
        step={numberInputSettings.qrCodeDims.step || 1}
        bind:value={$labelSettings.qrCodeDims}
        />
      </div>
      <div>
        <label for="robustness">{langs['robustness'][$appSettings.lang]}</label>
        <select id="robustness" bind:value={$labelSettings.qrCodeErrorLevel}>
          <option value="L">Low</option>
          <option value="M">Medium</option>
          <option value="Q">Quartile</option>
          <option value="H">High</option>
        </select>
      </div>
    {/if}
  </div>
  <p style="position:relative; margin:0; top:-1em; font-size:0.7em">{langs['saveSettings'][$appSettings.lang]}</p>
  <br/>
</div>

<style>

  label {
    display: inline;
    text-wrap: nowrap;
  }

  .cols {
    width: 100%;
    margin-top: 2em;
    column-count: 2;
    column-width: 50%;
    column-gap: 1em;
    margin-bottom: 1em;
  }
</style>