<script>
  import {getContext} from 'svelte'
  import langs from "../i18n/lang";
  import numberInputSettings from '../lib/numberInputSettings';

  const settings = getContext('settings')

  const fonts = ["Roboto Condensed", "Courier", 'PT Sans Narrow', 'Arial']
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

<label style="display:inline">
  <input type=checkbox bind:checked={$settings.labelPerSpecimen}>
  {langs[$settings.lang]['count']}
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.useRomanNumeralMonths}>
  {langs[$settings.lang]['romanNums']}
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.showInstitution}>
  {langs[$settings.lang]['collName']}
</label>
<br/>
{#if $settings.showInstitution}
<input type="text" bind:value={$settings.collectionName} style="display:inline; margin:0;height:10px" placeholder="Collection name..."><br>
<br/>
{/if}
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.detLabel}>
  {langs[$settings.lang]['dets']}
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.detLabelOnly}>
  {langs[$settings.lang]['detsOnly']}
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.includePunch}>
  {langs[$settings.lang]['punch']}
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.includeQRCode}>
  Include QR code
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.showStorage}>
  {langs[$settings.lang]['storage']}
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.includeTaxonAuthorities}>
  {langs[$settings.lang]['authors']}
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.excludeNoCatnums}>
  {langs[$settings.lang]['excludeCatNums']}
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.includeFieldNumber}>
  Include field number
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.includeProject}>
  Include project name
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.underline}>
  {langs[$settings.lang]['underline']}
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.italics}>
  italics for scientific names
</label>
<br/>
<label style="display:inline">
  <input type=checkbox bind:checked={$settings.addPrintedDate}>
  {langs[$settings.lang]['printDate']}
</label>
<br/>
{#if $settings.addPrintedDate}
<input type="text" bind:value={$settings.printerModel} style="display:inline; margin:0;height:10px" placeholder="Printer make and model"><br>
<br/>
{/if}
<div style="display:flex; gap:5px">
  <div>
    <label>{langs[$settings.lang]['font']}</label>
    <select bind:value={$settings.font}>
      {#each fonts as font}
      <option value={font}>{font}</option>
      {/each}
    </select>
  </div>
  {#if $settings.font in fontWeights}
  <div>
    <label>{langs[$settings.lang]['fontWeight']}</label>
    <select bind:value={$settings.fontWeight}>
      {#each fontWeights[$settings.font] as weightOption}
      <option value={weightOption}>{weightOption}</option>
      {/each}
    </select>
  </div>
  {/if}
  <div>
    <label>{langs[$settings.lang]['fontSize']}</label>
    <input type="number" name="fontSize" 
    min={numberInputSettings.fontSize.min} 
    max={numberInputSettings.fontSize.max} 
    step={numberInputSettings.fontSize.step || 1}
    on:keyup={handleKeyboardInput} 
    on:wheel={handleMouseWheel} bind:value={$settings.fontSize} >
  </div>
  <div>
    <label>{langs[$settings.lang]['lineHeight']}</label>
    <input type="number" name="lineHeight" 
    min={numberInputSettings.lineHeight.min} 
    max={numberInputSettings.lineHeight.max} 
    step={numberInputSettings.lineHeight.step || 1}
    on:keyup={handleKeyboardInput} 
    on:wheel={handleMouseWheel} bind:value={$settings.lineHeight} >
  </div>
  <div>
    <label>{langs[$settings.lang]['labelWidth']}</label>
    <div style="display:flex; align-items: baseline; ">
      <input type="number" name="labelWidth" 
      min={numberInputSettings.labelWidth.min} 
      max={numberInputSettings.labelWidth.max} 
      step={numberInputSettings.labelWidth.step || 1}
      on:keyup={handleKeyboardInput} 
      on:wheel={handleMouseWheel} bind:value={$settings.labelWidth} >
      <span>{langs[$settings.lang]['labelWidthUnit']}</span>
    </div>
  </div>
  {#if $settings.includeQRCode}
  <div>
    <label>QR Code size</label>
    <input type="number" name="qrCodeDims" 
    min={numberInputSettings.qrCodeDims.min} 
    max={numberInputSettings.qrCodeDims.max} 
    step={numberInputSettings.qrCodeDims.step || 1}
    on:keyup={handleKeyboardInput} 
    on:wheel={handleMouseWheel} bind:value={$settings.qrCodeDims} >
  </div>
  <div>
    <label>Robustness</label>
    <select bind:value={$settings.qrCodeErrorLevel}>
      <option value="L">Low</option>
      <option value="M">Medium</option>
      <option value="Q">Quartile</option>
      <option value="H">High</option>
    </select>
  </div>
  {/if}
</div>
<p style="position:relative; margin:0; top:-1em; font-size:0.7em">{langs[$settings.lang]['saveSettings']}</p>
<br/>