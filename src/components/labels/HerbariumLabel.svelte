<script>
  import { getContext } from "svelte";
  import getLabelDet from '../../lib/getLabelDet'
  import QRCode from 'qrcode'

  export let labelRecord

  const settings = getContext('settings')

  let labelDet = null
  let img

  $: if (labelRecord || $settings.includeTaxonAuthorities || $settings.italics) labelDet =  getLabelDet(labelRecord, $settings.includeTaxonAuthorities, false, $settings.italics)

  $: if($settings.includeQRCode && $settings.qrCodeErrorLevel && img && labelRecord && labelRecord.catalogNumber) {
    QRCode.toDataURL(labelRecord.catalogNumber, { margin: 0, errorCorrectionLevel: $settings.qrCodeErrorLevel }, function (error, url) {
      if (error) console.error(error)
      if (url) img.src = url
    })
  }

</script>

<div id="container" >
  <div id="header" class:bolder={!$settings.underline} class:underline={$settings.underline}>Bews Herbarium (NU)</div>
  <div id="subheader"  class:bolder={!$settings.underline} class:underline={$settings.underline}>University of KwaZulu-Natal</div>
  <div id="main" >
    <div id="taxon">
      <div>
        <div style="display:flex; justify-content:space-between">
          <div style="text-transform:uppercase" class="one-line-condensed" class:bolder={!$settings.underline} class:underline={$settings.underline}>{labelRecord.family || 'Familiaceae'}</div>
          <div>{labelRecord.genusCode || ''}</div>
        </div>
        <div>{labelDet || ''} </div>
      </div>
    </div>
    <div>
      <div id="locality" class="three-lines">{labelRecord.fullLocality || ''} </div>
      <div id="coords" class="one-line-condensed">{labelRecord.fullCoordsString || ''}</div>
    </div>
    <div class="three-lines">{labelRecord.habitat || ''}</div>
    <div class="two-lines">{labelRecord.description || ''}</div>
    <div class="two-lines">{labelRecord.notes || ''}</div>
    <div>
      <div>Coll: {labelRecord.recordedBy}</div>
      <div style="display: flex; justify-content:space-between">
        <div >{labelRecord.recordNumber[0].toUpperCase() + labelRecord.recordNumber.substring(1)}</div>
        <div>{labelRecord.collectionDate}</div>
      </div>
    </div>
    <div style="display: flex; justify-content:space-between;border-top:1px solid gray">
      {#if labelRecord.identifiedBy}
      <div>Det: {labelRecord.identifiedBy} </div>
      <div>{labelRecord.dateIdentified}</div>
      {:else}
      <div>Det:</div>
      {/if}
    </div>
  </div>
</div>

<style>

  #container {
    width:9cm;
    height:10cm;
    padding:.5em;
    display:flex; 
    flex-direction:column;
    align-items:center;
    font-size: 10pt;
    border-top:1px dashed gray;
    border-bottom:1px dashed gray;
  }

  #header {
    font-size: 12pt;
  }

  #main {
    width:100%; 
    padding:0.2em;
    flex:1 1 auto; 
    min-height:0; 
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    line-height: 100%;
  }

  #taxon {
    height: 3em;
    display: flex;
    align-items: center;
    border-bottom: 1px solid gray
  }

  .one-line-condensed {
    height: 1em;
    overflow:hidden;
  }

  .two-lines {
    height: 2.2em; 
    overflow:hidden;
  }

  .three-lines {
    height: 3.2em; 
    overflow:hidden;
  }

  .bolder {
    font-weight: bolder;
  }

  .underline {
    text-decoration: underline;
  }

</style>