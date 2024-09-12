<script>
  import {getContext, createEventDispatcher} from 'svelte'
  import langs from "../../i18n/lang";
  import numberInputSettings from '../../settings/numberInputSettings';

  const dispatch = createEventDispatcher()

  const appSettings = getContext('appSettings')
  const labelSettings = getContext('herbariumLabelSettings')

  const fonts = ["Roboto Condensed", "Courier", 'PT Sans Narrow', 'Times New Roman', 'Arial']

</script>
<div style="width: 100%;display:flex; flex-direction:column;">
  <div class="cols">
    <div style="break-inside: avoid;">
      <label style="display:inline;">
        <input type=checkbox bind:checked={$labelSettings.showCollectionName}>
        {langs['addCollName'][$appSettings.lang]}
      </label>
      <br/>
      {#if $labelSettings.showCollectionName}
        <input type="text" bind:value={$labelSettings.collectionName} style="display:inline;padding:10px;height:10px;" placeholder={langs['collName'][$appSettings.lang]}><br>
        <input type="text" bind:value={$labelSettings.institutionName} style="display:inline;padding:10px;height:10px;" placeholder={langs['inst'][$appSettings.lang]}><br>
      {/if}
    </div>
    <label style="display:inline">
      <input type=checkbox bind:checked={$labelSettings.detLabel}>
      {langs['detsOnly'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type=checkbox bind:checked={$labelSettings.includeBarcode}>
      {langs['barcode'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline;break-after:never;">
      <input type=checkbox bind:checked={$labelSettings.includeQRCode}> 
      {langs['qrCode'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type=checkbox bind:checked={$labelSettings.useRomanNumeralMonths} on:change={_ => dispatch('calc_labels')}>
      {langs['romanNums'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type=checkbox bind:checked={$labelSettings.includeTaxonAuthorities}>
      {langs['authors'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type=checkbox bind:checked={$labelSettings.underline}> <!-- TODO we need this for herbarium label separately -->
      {langs['underline'][$appSettings.lang]}
    </label>
    <br/>
    <label style="display:inline">
      <input type=checkbox bind:checked={$labelSettings.italics}> <!-- TODO we need this for herbarium label separately -->
      {langs['italics'][$appSettings.lang]}
    </label>
    <br/>
  </div>
  <div style="display:flex; gap:5px">
    <div>
      <label for="label-size">{langs['labelSize'][$appSettings.lang]}</label>
      <select id="label-size" bind:value={$labelSettings.labelSize} disabled={$labelSettings.detLabel}>
        <option value="standard">Standard</option>
        <option value="large">Extra height</option>
      </select>
    </div>
    <div>
      <label for="fonts">{langs['font'][$appSettings.lang]}</label>
      <select id="fonts" bind:value={$labelSettings.font}>
        {#each fonts as font}
        <option value={font}>{font}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="font-size">{langs['fontSize'][$appSettings.lang]}</label>
      <select id="font-size" bind:value={$labelSettings.fontSize}>
        <option value="8">8</option>
        <option value="10">10</option>
      </select>
    </div>
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