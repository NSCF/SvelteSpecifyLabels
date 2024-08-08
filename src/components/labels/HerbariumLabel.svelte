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

  $: if (labelRecord || $settings.includeTaxonAuthorities || $settings.italics) labelDet =  getLabelDet(labelRecord, $settings.includeTaxonAuthorities, true, $settings.italics)

  $: if($settings.includeQRCode && $settings.qrCodeErrorLevel && qrImg && labelRecord && labelRecord.catalogNumber) {
    QRCode.toDataURL(labelRecord.catalogNumber, { margin: 0, errorCorrectionLevel: $settings.qrCodeErrorLevel }, function (error, url) {
      if (error) console.error(error)
      if (url) qrImg.src = url
    })
  }

  $: if ($settings.includeBarcode && !$settings.includeQRCode && barcodeImg && labelRecord && labelRecord.catalogNumber) {
    JsBarcode(barcodeImg, labelRecord.catalogNumber, {width:0.8, height:30, margin: 0, displayValue: false} )
  }

</script>

<div id="label" 
  style="--font: {$settings.herbarimLabelFont};
  --label-width: {$settings.defaults.herbarium}
  ">
  {#if $settings.showHerbariumCollection}
    <div id="header">
      <div id="title"  class:bolder={!$settings.underline} class:underline={$settings.underline} style="font-size:12pt">{$settings.herbariumCollection || ''}</div>
      {#if $settings.herbariumInstitution}
        <div id="subtitle"  class:bolder={!$settings.underline} class:underline={$settings.underline}>{$settings.herbariumInstitution}</div>
      {/if}
    </div>
  {/if}
  <div id="main">
    <div id="taxon">
      <div style="width: 100%;">
        <div style="display:flex; justify-content:space-between">
          <div style="text-transform:uppercase" class="one-line-condensed" class:bolder={!$settings.underline} class:underline={$settings.underline}>{labelRecord.family || 'No family'}</div>
        </div>
        <div>{@html labelDet || ''} </div>
      </div>
    </div>
    <div id="details" >
      <div class="" style="display:flex;width:100%;align-items:center">
        <div style="width:100%">
          <div id="locality" >{labelRecord.fullLocality || ''} </div>
          <div style="width:100%;display:flex;justify-content:space-between">
            <div id="coords" class="">{labelRecord.fullCoordsString || ''} {labelRecord.gridReference ? '[' + labelRecord.gridReference + ']' : ''}</div>
            <div>{labelRecord.labelElevation ? 'Alt: ' + labelRecord.labelElevation : ''}</div>
          </div>
        </div>
      </div>
      <div class="">{labelRecord.habitat || ''}</div>
      <div class="">{labelRecord.description || ''}</div>
      <div class="">{labelRecord.notes || ''}</div>
      <div class="">
        <div>Coll: {labelRecord.recordedBy}{labelRecord.additionalCollectors ? ', with ' + labelRecord.additionalCollectors : ''}</div>
        <div style="display: flex; justify-content:space-between">
          {#if labelRecord.recordNumber}
            <div >{labelRecord.recordNumber[0].toUpperCase() + labelRecord.recordNumber.substring(1)}</div>
          {:else}
            <div></div>
          {/if}
          <div>{labelRecord.collectionDate || ''}</div>
        </div>
      </div>
      <div class="" style="display: flex; justify-content:space-between;" >
        {#if labelRecord.identifiedBy}
        <div>Det: {labelRecord.identifiedBy} </div>
        <div>{labelRecord.dateIdentified}</div>
        {:else}
        <div>Det:</div>
        {/if}
      </div>
    </div>
    <div id="filing" class="" style="width:100%; border-top:1px solid black;">
      <div class="" style="width:100%;display:flex;justify-content:space-between;">
        {#if labelRecord.familyCode}
          <div style="width:30%">Family: {labelRecord.familyCode}</div>
        {/if}
        {#if labelRecord.genusCode}
          <div style="width:30%; white-space: nowrap;">Genus: {labelRecord.genusCode}</div>
        {/if}
      </div>
      <div class="" style="width:100%;display:flex;justify-content:space-between;align-items:center;height:35px;margin-top:{$settings.includeQRCode ? '5px': '0'}; ">
        <div>{labelRecord.catalogNumber}</div>
        {#if $settings.includeQRCode}
          <img style="height: 100%;margin-right:20px;" alt="QR code" bind:this={qrImg}/>
        {:else if $settings.includeBarcode}
          <svg alt="barcode" style="" bind:this={barcodeImg}/>
        {/if}
      </div>
      <div>Project: {labelRecord.project || ''}</div>
      <div style="display: flex; justify-content:space-between">
        <div>
          Dups: {labelRecord.duplicates || ''}
        </div> 
        <div>
          {#if labelRecord.permitNumber}
            Permit: {labelRecord.permitNumber}
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>

  #label {
    width: var(--label-width, 9cm);
    height:9.5cm;
    padding:.5em;
    display:flex; 
    flex-direction:column;
    align-items:center;
    font-family: var(--font, sans-serif);
    font-size: 10pt;
    /* border-top:1px dashed gray; */
    /* border-bottom:1px dashed gray; */
    break-inside:avoid;
  }

  #header {
    width:100%;
    display:flex;
    flex-direction:column; 
    align-items:center;
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
    width: 100%;
    display:flex;
    flex-direction:column; 
    height: 3em;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid gray
  }

  #details {
    padding-top: 5px;
    padding-bottom: 5px;
    flex:1 1 auto; 
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .bolder {
    font-weight: bolder;
  }

  .underline {
    text-decoration: underline;
  }

</style>