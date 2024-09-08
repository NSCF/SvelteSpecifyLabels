<script>
  import { getContext, createEventDispatcher } from "svelte";
  import getLabelDet from '../../lib/getLabelDet'
  import QRCode from 'qrcode'
  import JsBarcode from "jsbarcode";

  const dispatch = createEventDispatcher()

  export let labelRecord

  const labelSettings = getContext('herbariumLabelSettings')

  let labelDet = null
  let qrImg
  let barcodeImg

  $: if (labelRecord || $labelSettings.includeTaxonAuthorities || $labelSettings.italics) labelDet =  getLabelDet(labelRecord, $labelSettings.includeTaxonAuthorities, true, $labelSettings.italics)

  $: if($labelSettings.includeQRCode && $labelSettings.qrCodeErrorLevel && qrImg && labelRecord && labelRecord.catalogNumber) {
    QRCode.toDataURL(labelRecord.catalogNumber, { margin: 0, errorCorrectionLevel: $labelSettings.qrCodeErrorLevel }, function (error, url) {
      if (error) console.error(error)
      if (url) qrImg.src = url
    })
  }

  $: if ($labelSettings.includeBarcode && !$labelSettings.includeQRCode && barcodeImg && labelRecord && labelRecord.catalogNumber) {
    JsBarcode(barcodeImg, labelRecord.catalogNumber, { width:1.2, height:30, margin: 0, displayValue: false} )
  }

  const labelRendered = _ => {
    dispatch('label-rendered')
  }

</script>

<div id="container" 
  style="
  --font: {$labelSettings.font};
  --font-size: {$labelSettings.fontSize + 'pt'};"
  >
  {#if !$labelSettings.detLabel}
    <div id="herbarium-label" 
      style="--label-width: {$labelSettings.labelWidth};
      --label-height: {$labelSettings.labelSize == 'standard'? '9.5cm' : '12cm'};"
      use:labelRendered
      >
      {#if $labelSettings.showCollectionName}
        <div id="header">
          <div id="title"  class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline} style="font-size:1.2em">{$labelSettings.collectionName || ''}</div>
          {#if $labelSettings.institutionName}
            <div id="subtitle"  class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline}>{$labelSettings.institutionName}</div>
          {/if}
        </div>
      {/if}
      <div id="main">
        <div id="taxon">
          <div style="width: 100%;">
            <div style="display:flex; justify-content:space-between">
              <div style="text-transform:uppercase" class="one-line-condensed" class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline}>{labelRecord.family || 'No family'}</div>
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
                {#if typeof labelRecord.recordNumber == 'number'}
                  {#if labelRecord.primaryCollectorLastName}
                  <div>{labelRecord.primaryCollectorLastName} {labelRecord.recordNumber}</div>
                  {:else}
                  <div>Coll. no. {labelRecord.recordNumber}</div>
                  {/if}
                {:else}
                <div>{labelRecord.recordNumber}</div>
                {/if}
              {:else}
              <div></div><!-- placeholder for the flex -->
              {/if}
              <div>{labelRecord.collectionDate || ''}</div>
            </div>
          </div>
          <div class="" style="display: flex; justify-content:space-between;" >
            {#if labelRecord.identifiedBy}
            <div>Det: {labelRecord.identifiedBy} </div>
            <div>{labelRecord.dateIdentified ||''}</div>
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
          <div class="" style="width:100%;display:flex;justify-content:space-between;align-items:center;height:35px;margin-top:{$labelSettings.includeQRCode ? '5px': '0'}; ">
            <div>{labelRecord.catalogNumber}</div>
            {#if $labelSettings.includeQRCode}
              <img style="height: 100%;margin-right:20px;" alt="QR code" bind:this={qrImg}/>
            {:else if $labelSettings.includeBarcode}
              <svg alt="barcode" style="image-rendering: crisp-edges;" bind:this={barcodeImg}/>
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
  {:else}
    <div id='det-label' style="border:2px solid whitesmoke;">
      <div style="display:flex; justify-content:flex-end;">
        {#if labelRecord.catalogNumber}
          <div>{labelRecord.catalogNumber}</div>
        {:else if labelRecord.recordNumber}
          {#if isNaN(labelRecord.recordNumber)}
            <div>{labelRecord.recordNumber}</div>
          {:else}
            {#if labelRecord.primaryCollectorLastName}
              <div>{labelRecord.primaryCollectorLastName} {labelRecord.recordNumber}</div>
            {:else}
              <div>Coll. no. {labelRecord.recordedBy? labelRecord.recordedBy.split(/[,\s;]/)[0] : ''} {labelRecord.recordNumber}</div>
            {/if}
          {/if}
        {/if}
      </div>
      <div class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline}>{@html labelDet || ''}</div>
      <div style="display:flex;justify-content:space-between">
        <div>{labelRecord.identifiedBy}</div>
        <div>{labelRecord.dateIdentified}</div>
      </div>
      {#if labelRecord.identificationRemarks}
        <div>
          {labelRecord.identificationRemarks}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>

  #container {
    padding:.5em;
    font-family: var(--font, sans-serif);
    font-size: var(--font-size, 10pt);
    break-inside:avoid;
  }

  #herbarium-label {
    width: var(--label-width, 9cm);
    height: var(--label-height, 9.5cm);
    display:flex; 
    flex-direction:column;
    align-items:center;
    /* border-top:1px dashed gray; */
    /* border-bottom:1px dashed gray; */
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
  #det-label {
    /* height:2.5cm; */
    width:8cm;
    margin: auto;
    padding: 10px;
  }

  .bolder {
    font-weight: bolder;
  }

  .underline {
    text-decoration: underline;
  }

</style>