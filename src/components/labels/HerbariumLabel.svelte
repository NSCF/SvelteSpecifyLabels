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

  $: if (labelRecord || $settings.includeTaxonAuthorities || $settings.italics) labelDet =  getLabelDet(labelRecord, $settings.includeTaxonAuthorities, false, $settings.italics), console.log(labelDet)

  $: if($settings.includeQRCode && $settings.qrCodeErrorLevel && qrImg && labelRecord && labelRecord.catalogNumber) {
    QRCode.toDataURL('PRE0023456-0', { margin: 0, errorCorrectionLevel: $settings.qrCodeErrorLevel }, function (error, url) {
      if (error) console.error(error)
      if (url) qrImg.src = url
    })
  }

  $: if ($settings.includeBarcode && !$settings.includeQRCode && barcodeImg && labelRecord && labelRecord.catalogNumber) {
    JsBarcode(barcodeImg, 'PRE0023456-0', {width:1, height:20, margin: 0, displayValue: false} )
  }

</script>

<div id="label" >
  <div id="header">
    <div id="title"  class:bolder={!$settings.underline} class:underline={$settings.underline} style="font-size:12pt">Bews Herbarium (NU)</div>
    <div id="subtitle"  class:bolder={!$settings.underline} class:underline={$settings.underline}>University of KwaZulu-Natal</div>
  </div>
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
        <div>
          <div id="locality" >{labelRecord.fullLocality || ''} </div>
          <div id="coords" class="">{labelRecord.fullCoordsString || ''} {labelRecord.labelElevation ? 'Alt: ' + labelRecord.labelElevation : ''}</div>
        </div>
      </div>
      <div class="">{labelRecord.habitat || ''}</div>
      <div class="">{labelRecord.description || ''}</div>
      <div class="">{labelRecord.notes || ''}</div>
      <div class="">
        <div>Coll: {labelRecord.recordedBy}{labelRecord.additionalCollectors ? ', with ' + labelRecord.additionalCollectors : ''}</div>
        <div style="display: flex; justify-content:space-between">
          <div >{labelRecord.recordNumber[0].toUpperCase() + labelRecord.recordNumber.substring(1)}</div>
          <div>{labelRecord.collectionDate}</div>
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
      <div class="" style="display: flex; justify-content:space-between; width:100%;z-index:10!">
        <div style="width:15%">Family:</div>
        <div style="width:30%;">{labelRecord.familyCode || ''}</div>
        <div style="width:25%; white-space: nowrap;">Genus:</div>
        <div style="width:30%;">{labelRecord.genusCode || ''}</div>
      </div>
      <div class="" style="width:100%;display:flex;justify-content:space-between;align-items:center;height:35px">
        <div>{labelRecord.catalogNumber}</div>
        {#if $settings.includeQRCode}
          <img style="height: 100%;margin-right:20px" alt="QR code" bind:this={qrImg}/>
        {:else if $settings.includeBarcode}
          <svg alt="barcode" style="z-index: 0;" bind:this={barcodeImg}/>
        {/if}
      </div>
      <div>Special collections:</div>
      <div>Dups: {labelRecord.duplicates}</div> 
    </div>
  </div>
</div>

<style>

  #label {
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