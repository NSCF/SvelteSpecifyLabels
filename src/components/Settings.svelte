<script>
  import {getContext, createEventDispatcher} from 'svelte'
  import langs from "../i18n/lang";
  import numberInputSettings from '../lib/numberInputSettings';

  const dispatch = createEventDispatcher()

  const settings = getContext('settings')

  const fonts = ["Roboto Condensed", "Courier", 'PT Sans Narrow', 'Times New Roman', 'Arial']
	//only include fonts here where we want to give the user an option to choose
	const fontWeights = {
		"Roboto Condensed": [100, 200, 300, 400]
	}

	$: if( !($settings.font in fontWeights) ) $settings.fontWeight = 400

	const handleKeyboardInput = ev => {
    const field = ev.target.name
		if ($settings[field] > numberInputSettings[field].max ) {
			$settings[field] = numberInputSettings[field].max
		}
		if ($settings[field] < numberInputSettings[field].min ) {
			$settings[field] = numberInputSettings[field].min
		}
	}

  const handleMouseWheel = ev => {
    if (document.activeElement === ev.target) {
      ev.preventDefault()
      const field = ev.target.name
      let step = numberInputSettings[field].step || 1
      let currentValue = Number(ev.target.value)
      if (ev.deltaY < 0) {
        if (currentValue + step <= numberInputSettings[field].max) {
          $settings[field] = currentValue + step
        }
      }
      if (ev.deltaY > 0) {
        if (currentValue - step >= numberInputSettings[field].min) {
          $settings[field] = currentValue - step
        }
      }
    }

  }

</script>
<div class="cols">
  <label style="display:inline">
    Label type
    <br/>
    <input type="radio" id="wetlabel" name="label-type" value="general" bind:group={$settings.type} on:change={_ => dispatch('type-change')}>
    <label for="wetlabel">{langs['wet'][$settings.lang]}</label><br>
    <input type="radio" id="herbariumlabel" name="label-type" value="herbarium" bind:group={$settings.type} on:change={_ => dispatch('type-change')}>
    <label for="herbariumlabel">{langs['herbarium'][$settings.lang]}</label><br>
    <input type="radio" id="insectlabel" name="label-type" value="insect" bind:group={$settings.type} disabled on:change={_ => dispatch('type-change')}>
    <label for="insectlabel">{langs['insect'][$settings.lang]} ({langs['coming'][$settings.lang]})</label>
  </label>
  <br/>
  {#if $settings.type == 'herbarium'}
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.labelsPerHerbariumSpecimen}>
    {langs['count'][$settings.lang]}
  </label>
  {:else}
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.labelPerSpecimen}>
    {langs['count'][$settings.lang]}
  </label>
  {/if}
  <br/>
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.useRomanNumeralMonths} on:change={_ => dispatch('calc_labels')}>
    {langs['romanNums'][$settings.lang]}
  </label>
  <br/>
  {#if $settings.type == 'herbarium'}
    <div style="break-inside: avoid;">
      <label style="display:inline;">
        <input type=checkbox bind:checked={$settings.showHerbariumCollection}>
        {langs['addCollName'][$settings.lang]}
      </label>
      <br/>
      {#if $settings.showHerbariumCollection}
      <input type="text" bind:value={$settings.herbariumCollection} style="display:inline;padding:10px;height:10px;" placeholder={langs['collName'][$settings.lang]}><br>
      <input type="text" bind:value={$settings.herbariumInstitution} style="display:inline;padding:10px;height:10px;" placeholder={langs['inst'][$settings.lang]}><br>
      <br/>
      {/if}
    </div>
  {:else}
    <label style="display:inline;">
      <input type=checkbox bind:checked={$settings.showInstitution}>
      {langs['addCollName'][$settings.lang]}
    </label>
    <br/>
    {#if $settings.showInstitution}
      <input type="text" bind:value={$settings.collectionName} style="display:inline;padding:10px;height:10px" placeholder={langs['collName'][$settings.lang]}><br>
      <br/>
    {/if}
  {/if}
  {#if $settings.type != "herbarium"}
    <label style="display:inline">
      <input type=checkbox bind:checked={$settings.detLabel}>
      {langs['dets'][$settings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type=checkbox bind:checked={$settings.detLabelOnly}>
      {langs['detsOnly'][$settings.lang]}
    </label>
    <br/>
  {/if}
  {#if $settings.type == "general"}
    <label style="display:inline">
      <input type=checkbox bind:checked={$settings.includePunch}>
      {langs['punch'][$settings.lang]}
    </label>
    <br/>
  {/if}
  {#if $settings.type == 'herbarium'}
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.includeBarcode}>
    {langs['barcode'][$settings.lang]}
  </label>
  <br/>
  {/if}
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.includeQRCode}>
    {langs['qrCode'][$settings.lang]}
  </label>
  <br/>
  {#if $settings.type != "herbarium" && $settings.includeQRCode && $settings.detLabel && !$settings.detLabelOnly}
    <label style="display:inline">
      <input type=checkbox style="margin-left:2em;" bind:checked={$settings.qrCodeOnDetLabels}>
      {langs['onDetLabels'][$settings.lang]}
    </label>
    <br/>
  {/if}
  {#if $settings.type == 'general'}
    <label style="display:inline">
      <input type=checkbox bind:checked={$settings.showStorage} on:change={_ => dispatch('calc_labels')}>
      {langs['storage'][$settings.lang]}
    </label>
    <br/>
  {/if}
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.includeTaxonAuthorities}>
    {langs['authors'][$settings.lang]}
  </label>
  <br/>
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.excludeNoCatnums} on:change={_ => dispatch('calc_labels')}>
    {langs['excludeCatNums'][$settings.lang]}
  </label>
  <br/>
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.includeCollectorInSort} on:change={_ => dispatch('calc_labels')}>
    {langs['sortOnCollectors'][$settings.lang]}
  </label>
  <br/>
  {#if $settings.type != 'herbarium'}
    <label style="display:inline">
      <input type=checkbox bind:checked={$settings.includeFieldNumber}>
      {langs['fieldNumber'][$settings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type=checkbox bind:checked={$settings.includeProject}>
      {langs['project'][$settings.lang]}
    </label>
    <br/>
  {/if}
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.underline}>
    {langs['underline'][$settings.lang]}
  </label>
  <br/>
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.italics}>
    {langs['italics'][$settings.lang]}
  </label>
  <br/>
  {#if $settings.type != 'herbarium'}
    <label style="display:inline">
      <input type=checkbox bind:checked={$settings.addPrintedDate}>
      {langs['printDate'][$settings.lang]}
    </label>
  {/if}
  <br/>
  {#if $settings.addPrintedDate}
    <input type="text" bind:value={$settings.printerModel} style="display:inline; margin:0;height:10px" placeholder={langs['printer'][$settings.lang]}><br>
    <br/>
  {/if}
</div>
<div style="display:flex; gap:5px">
  {#if $settings.type == 'herbarium'}
    <div>
      <label for="fonts">{langs['font'][$settings.lang]}</label>
      <select id="fonts" bind:value={$settings.herbarimLabelFont}>
        {#each fonts as font}
        <option value={font}>{font}</option>
        {/each}
      </select>
    </div>
  {:else if $settings.type == 'general'}
    <div>
      <label for="fonts">{langs['font'][$settings.lang]}</label>
      <select id="fonts" bind:value={$settings.font}>
        {#each fonts as font}
        <option value={font}>{font}</option>
        {/each}
      </select>
    </div>
    {#if $settings.font in fontWeights}
    <div>
      <label for="font-weight">{langs['fontWeight'][$settings.lang]}</label>
      <select id="font-weight" bind:value={$settings.fontWeight}>
        {#each fontWeights[$settings.font] as weightOption}
        <option value={weightOption}>{weightOption}</option>
        {/each}
      </select>
    </div>
    {/if}
    <div>
      <label for="font=size">{langs['fontSize'][$settings.lang]}</label>
      <input id="font-size" type="number" name="fontSize" 
      min={numberInputSettings.fontSize.min} 
      max={numberInputSettings.fontSize.max} 
      step={numberInputSettings.fontSize.step || 1}
      on:keyup={handleKeyboardInput} 
      on:wheel={handleMouseWheel} bind:value={$settings.fontSize} >
    </div>
    <div>
      <label for="line-height">{langs['lineHeight'][$settings.lang]}</label>
      <input id="line-height" type="number" name="lineHeight" 
      min={numberInputSettings.lineHeight.min} 
      max={numberInputSettings.lineHeight.max} 
      step={numberInputSettings.lineHeight.step || 1}
      on:keyup={handleKeyboardInput} 
      on:wheel={handleMouseWheel} bind:value={$settings.lineHeight} >
    </div>
    <div>
      <label for="label-width">{langs['labelWidth'][$settings.lang]}</label>
      <div id="label-width" style="display:flex; align-items: baseline; ">
        <input type="number" name="labelWidth" 
        min={numberInputSettings.labelWidth.min} 
        max={numberInputSettings.labelWidth.max} 
        step={numberInputSettings.labelWidth.step || 1}
        on:keyup={handleKeyboardInput} 
        on:wheel={handleMouseWheel} bind:value={$settings.labelWidth} >
        <span>{langs['labelWidthUnit'][$settings.lang]}</span>
      </div>
    </div>
    {#if $settings.includeQRCode}
    <div>
      <label for="qrcode-size">{langs['qrCodeSize'][$settings.lang]}</label>
      <input id="qrcode-size" type="number" name="qrCodeDims" 
      min={numberInputSettings.qrCodeDims.min} 
      max={numberInputSettings.qrCodeDims.max} 
      step={numberInputSettings.qrCodeDims.step || 1}
      on:keyup={handleKeyboardInput} 
      on:wheel={handleMouseWheel} bind:value={$settings.qrCodeDims} >
    </div>
    <div>
      <label for="robustness">{langs['robustness'][$settings.lang]}</label>
      <select id="robustness" bind:value={$settings.qrCodeErrorLevel}>
        <option value="L">Low</option>
        <option value="M">Medium</option>
        <option value="Q">Quartile</option>
        <option value="H">High</option>
      </select>
    </div>
    {/if}
  {/if}
</div>
<p style="position:relative; margin:0; top:-1em; font-size:0.7em">{langs['saveSettings'][$settings.lang]}</p>
<br/>

<style>
  .cols {
    width: 100%;
    margin-top: 2em;
    column-count: 2;
    column-width: 50%;
    column-gap: 1em;
    margin-bottom: 1em;
  }
</style>