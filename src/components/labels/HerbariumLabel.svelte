<script>
  import { getContext } from "svelte";
  import getLabelDet from '../../lib/getLabelDet'
  import QRCode from 'qrcode'
  import JsBarcode from "jsbarcode";

  export let labelRecord

  const settings = getContext('settings')

  let labelDet = null
  let qrImg
  let barcodeImg

  $: if (labelRecord || $settings.includeTaxonAuthorities || $settings.italics) labelDet =  getLabelDet(labelRecord, $settings.includeTaxonAuthorities, false, $settings.italics)

  $: if($settings.includeQRCode && $settings.qrCodeErrorLevel && qrImg && labelRecord && labelRecord.catalogNumber) {
    console.log('creating QR code')
    QRCode.toDataURL('PRE0023456-0', { margin: 0, errorCorrectionLevel: $settings.qrCodeErrorLevel }, function (error, url) {
      if (error) console.error(error)
      if (url) qrImg.src = url
    })
  }

  $: if ($settings.includeBarcode && !$settings.includeQRCode && barcodeImg && labelRecord && labelRecord.catalogNumber) {
    console.log('creating barcode')
    JsBarcode(barcodeImg, 'PRE0023456-0', {width:1, height:20, displayValue: false} )
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
    <div style="display: flex; justify-content:space-between;">
      {#if labelRecord.identifiedBy}
      <div>Det: {labelRecord.identifiedBy} </div>
      <div>{labelRecord.dateIdentified}</div>
      {:else}
      <div>Det:</div>
      {/if}
    </div>
    <div id="filing" style="width:100%; border-top:1px solid black;">
      <div class="" style="display: flex; justify-content:space-between; width:100%;">
        <div style="width:15%">Family:</div>
        <div style="width:30%;">{labelRecord.familyCode || ''}</div>
        <div style="width:25%; white-space: nowrap;">Genus:</div>
        <div style="width:30%;">{labelRecord.genusCode || ''}</div>
      </div>
      <div class="two-lines" style="width:100%;display:flex;justify-content:space-between;align-items:center;height:35px">
        <div>{labelRecord.catalogNumber}</div>
        {#if $settings.includeQRCode}
          <img style="height: 100%;margin-right:20px" alt="QR code" bind:this={qrImg}/>
        {:else if $settings.includeBarcode}
          <svg alt="barcode" bind:this={barcodeImg}/>
        {/if}
      </div>
      <div>Special collections:</div>
      <div>Dups: asdfasdf</div> 
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