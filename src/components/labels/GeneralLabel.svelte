<script>
  import CutMarks from "../misc/CutMarks.svelte";
  import { getContext, createEventDispatcher } from "svelte";
  import getLabelDet from '../../lib/getLabelDet'
  import QRCode from 'qrcode'

  export let labelRecord

  const dispatch = createEventDispatcher()
  const labelSettings = getContext('generalLabelSettings')

  let labelDet = null
  let img

  $: if (labelRecord || $labelSettings.includeTaxonAuthorities || $labelSettings.italics) labelDet =  getLabelDet(labelRecord, $labelSettings.includeTaxonAuthorities, false, $labelSettings.italics)

  $: if($labelSettings.includeQRCode && $labelSettings.qrCodeErrorLevel && img && labelRecord && labelRecord.catalogNumber) {
    QRCode.toDataURL(labelRecord.catalogNumber, { margin: 0, errorCorrectionLevel: $labelSettings.qrCodeErrorLevel }, function (error, url) {
      if (error) console.error(error)
      if (url) img.src = url
    })
  }

  const getPrintDateString = _ => {
    const now = new Date()
    const month = now.toLocaleString('default', { month: 'short' });
    const year = now.getFullYear()
    return `${month}, ${year}`
  }

  const collectorNumberString = _ => {
    let collectorNumberString = ''
    if (labelRecord && labelRecord.recordNumber) {
      if (typeof labelRecord.recordNumber == 'number') {
        if (labelRecord.primaryCollectorLastName) {
          collectorNumberString += labelRecord.primaryCollectorLastName + ' ' + labelRecord.recordNumber
        }
        else {
          collectorNumberString += ' coll. no. ' + labelRecord.recordNumber
        }
      }
      else {
        collectorNumberString = labelRecord.recordNumber
      }
    }

    return collectorNumberString

  }

  const labelRendered = _ => {
    dispatch('label-rendered')
  }

</script>

<div class="label" 
  style="--font: {$labelSettings.font}; 
  --font-weight: {$labelSettings.fontWeight};
  --font-size: { $labelSettings.fontSize + 'pt'}; 
  --line-height: {$labelSettings.lineHeight + '%'};
  --label-width: { $labelSettings.labelWidth + 'cm' };
  " 
  use:labelRendered>
  {#if $labelSettings.showStorage}
    {#if labelRecord.storageBox}
      <div style="padding:4px;">Box: {labelRecord.storageBox} -- cut this off label</div>
    {:else}
      <div style="padding:4px;">No storage recorded -- cut this off label</div>
    {/if}
  <CutMarks char={'—'}/>
  {/if}
  {#if !$labelSettings.detLabelOnly}
    {#if $labelSettings.showInstitution}
      <div style="width:100%; text-align:center;margin-bottom:.5em;" class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline}>
        {$labelSettings.collectionName || ''}
      </div>
    {/if}
    <div class="label-part">
      {#if $labelSettings.includePunch}
        <div class="labelpunch">
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="2" fill="black" />
          </svg> 
        </div>
      {/if}
      <div class="labeltext">
        {#if labelRecord.catalogNumber || labelRecord.recordNumber || labelRecord.fieldNumber}
          <div style="display:flex; flex-direction:row-reverse; justify-content:space-between;margin-right:1em">
            {#if labelRecord.recordNumber || labelRecord.fieldNumber}
              <div class:bolder={!labelRecord.catalogNumber && !$labelSettings.underline} class:underline={!labelRecord.catalogNumber && $labelSettings.underline}>
                {#if $labelSettings.includeFieldNumber && labelRecord.fieldNumber}
                <span>{labelRecord.fieldNumber}{labelRecord.recordNumber? ' / ' +  labelRecord.recordNumber: ''}</span>
                {:else}
                <span>{collectorNumberString()}</span>
                {/if}
              </div>
            {/if}
            {#if labelRecord.catalogNumber}
              <div class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline}>{labelRecord.catalogNumber}</div>
            {/if}
          </div>
        {/if}
        <div class="labelrow clearfloat">
          {#if labelRecord.fullLocality}
            {labelRecord.fullLocality}
          {/if}
          {#if labelRecord.labelElevation}
            <span class="inlineblock">{labelRecord.labelElevation}</span>
          {/if}
        </div>
        {#if labelRecord.fullCoordsString}
          <div class="inlineblock">{labelRecord.fullCoordsString}</div>
        {/if}    
        <div class="labelrow">
          {labelRecord.habitat || ''}
        </div>
        <div class="labelrow">
          {#if labelRecord.collectionDate}
            <span class="padright-sm">{labelRecord.collectionDate}</span>
          {/if}
          {#if labelRecord.recordedBy && labelRecord.recordedBy.length}
            {#each labelRecord.recordedBy as coll}
              <span class="inlineblock padright-sm">{coll}</span>
            {/each}
          {/if}
          {#if labelRecord.permitNumber}
            <span class="inlineblock padright-sm">Permit:&nbsp;{labelRecord.permitNumber}</span>
          {/if}  
          {#if labelRecord.samplingProtocol && !labelRecord.eventRemarks}
            <span class="inlineblock">{labelRecord.samplingProtocol}</span>
          {/if}
        </div>
        <div class="labelrow">
          {#if labelRecord.samplingProtocol && labelRecord.eventRemarks}
            <span class="inlineblock">{labelRecord.samplingProtocol} ({labelRecord.eventRemarks.toLowerCase()})</span>
          {:else}
            {labelRecord.eventRemarks || ''}
          {/if}
        </div>
        {#if labelRecord.specimenCount}
          {#if labelRecord.specimenStageSex && labelRecord.specimenStageSex.match(/(\d+)/g).reduce((x, y) => x + Number(y), 0) == Number(labelRecord.specimenCount)}
            <span class="inlineblock">{labelRecord.specimenStageSex}</span>
          {:else}
            <div>
              <span class="padright">Specimens:&nbsp;{labelRecord.specimenCount}</span>
              {#if labelRecord.specimenStageSex}
                <span class="inlineblock">({labelRecord.specimenStageSex})</span>
              {/if}
            </div>
          {/if}
        {:else} 
          {#if labelRecord.specimenStageSex}
            <span class="inlineblock">{labelRecord.specimenStageSex}</span>
          {/if}
        {/if}
        <div>
          {labelRecord.occurrenceRemarks || ''}
        </div>
        {#if labelRecord.typeStatus}
          <div class="clearfix">
            <span class="floatleft uppercase">{labelRecord.typeStatus}</span>
            {#if labelRecord.typeNumber}
              <span class="floatright">Type No:{labelRecord.typeNumber}</span>
            {/if}
          </div>
        {/if}
        {#if $labelSettings.addPrintedDate}
          <div class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline} >Printed on {$labelSettings.printerModel ? $labelSettings.printerModel : ''} {getPrintDateString()}</div>
        {/if}
        {#if labelRecord.project && $labelSettings.includeProject}
          <div class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline} >{labelRecord.project}</div>
        {/if}
      </div>
      {#if labelRecord.catalogNumber && $labelSettings.includeQRCode && !($labelSettings.detLabelOnly || $labelSettings.qrCodeOnDetLabels)}
        <div style="margin:.25em;">
          <img width={$labelSettings.qrCodeDims} height={$labelSettings.qrCodeDims} bind:this={img} alt="QR code"/>
        </div>
      {/if}
    </div>
  {/if}
  {#if labelRecord.seriesSampleCounts && Array.isArray(labelRecord.seriesSampleCounts) && labelRecord.seriesSampleCounts.length > 1} <!--this is customized for label data from Arthrobase-->
    <CutMarks char={'—'} />
    <div class="label-part">
      <div class="labeltext">
        <div class="inlineblock" class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline}>
          Collecting events:
        </div>
        {#if labelRecord.catalogNumber || labelRecord.recordNumber || labelRecord.fieldNumber}
          <div style="display:flex; flex-direction:row-reverse; justify-content:space-between;margin-right:1em">
            {#if labelRecord.recordNumber}
              <div class:bolder={!labelRecord.catalogNumber && !$labelSettings.underline} class:underline={!labelRecord.catalogNumber && $labelSettings.underline}>
                {#if $labelSettings.includeFieldNumber && labelRecord.fieldNumber}
                  <span>{labelRecord.fieldNumber}{labelRecord.recordNumber? ' / ' + labelRecord.recordNumber : ''}</span>
                {:else}
                  <span>{collectorNumberString()}</span>
                {/if}
              </div>
            {/if}
            {#if labelRecord.catalogNumber}
              <div class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline}>{labelRecord.catalogNumber}</div>
            {/if}
          </div>
        {/if}
        {#each labelRecord.seriesSampleCounts as ssc}
          {#if ssc.collectingDate}
            <br/>
            <div>{ssc.collectingDate}</div>
            {#if ssc.collectors}
              <div>{ssc.collectors}</div>
            {/if}
            {#if ssc.collectMethods}
              <div>{ssc.collectMethods}</div>
            {/if}
            {#if ssc.conditions}
              <div>{ssc.conditions}</div>
            {/if}
            {#if ssc.lifeStageSexCounts}
              <div>{ssc.lifeStageSexCounts}</div>
            {/if}
            <br/>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
  {#if ($labelSettings.detLabel || $labelSettings.detLabelOnly) && labelDet} <!-- Apologies to readers for these, detLabel flags whether to add the label, labelDet is what goes on the label -->
    {#if !$labelSettings.detLabelOnly}
      <CutMarks char={'—'}/>
    {/if}
    {#if $labelSettings.detLabelOnly && $labelSettings.showCollectionName}
      <div style="width:100%; text-align:center;margin-bottom:.5em;" class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline}>
        {$labelSettings.collectionName || ''}
      </div>
    {/if}
    <div class="label-part det-label">
      {#if $labelSettings.includePunch}
        <div class="labelpunch">
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="2" fill="black" />
          </svg> 
        </div>
      {/if}
      <div class="labeltext">
        <div style="display:flex; justify-content:space-between;margin-right:1em">
          {#if labelRecord.typeStatus}
            <div class="uppercase">{labelRecord.typeStatus}</div>
          {:else if labelRecord.catalogNumber || labelRecord.recordNumber}
            <div /> <!-- a placeholder -->
          {/if}
          {#if labelRecord.catalogNumber}
            <div class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline}>{labelRecord.catalogNumber}</div>
          {:else if labelRecord.recordNumber || labelRecord.fieldNumber}
            <div class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline}>
              {#if $labelSettings.includeFieldNumber && labelRecord.fieldNumber}
              <span>{labelRecord.fieldNumber}{labelRecord.recordNumber ? ' / ' + labelRecord.recordNumber : ''}</span>
              {:else}
              <span>{collectorNumberString()}</span>
              {/if}
            </div>            
          {/if}
        </div>
        <div class="clearfloat">
          <span class="inlineblock" class:bolder={!$labelSettings.underline} class:underline={$labelSettings.underline}>{@html labelDet}</span>
        </div>
        <div>
          {#if labelRecord.identifiedBy || labelRecord.dateIdentified}
            <span>det: </span>
            <span >{labelRecord.identifiedBy || ''}</span>
            <span class="inlineblock">{labelRecord.dateIdentified || ''}</span>
          {/if}
        </div>
        <div>
          {labelRecord.identificationRemarks || ''}
        </div>
        {#if labelRecord.typeStatus && labelRecord.typeNumber}
          <div class="clearfix">
            <span class="floatright">Type No:{labelRecord.typeNumber}</span>
          </div>
        {/if}
      </div>
      {#if labelRecord.catalogNumber && $labelSettings.includeQRCode && ($labelSettings.detLabelOnly || $labelSettings.qrCodeOnDetLabels) }
        <div style="margin:.25em;">
          <img width={$labelSettings.qrCodeDims} height={$labelSettings.qrCodeDims} bind:this={img} alt="QR code"/>
        </div>
      {/if}
    </div>
  {/if}
  <CutMarks char={'-'}/>
</div>

<style>

  .label {
    position: relative;
    font-family: var(--font, sans-serif);
    font-size: calc(var(--font-size, 10pt));
    font-weight: var(--font-weight, 400);
    line-height: var(--line-height, 105%);
    break-inside:avoid;
  }

  .label-part {
    display:flex;
    flex-direction: row;
    align-items: center;
    padding-top:3px;
    padding-bottom:3px;
    min-height: 0cm;
  }

  .det-label {
    min-height: 0cm;
  }

  .clearfix::after {
    content: "";
    clear: both;
    display: table;
  }

  .underline {
    text-decoration: underline;
  }

  .bolder {
    font-weight: bolder;
  }

  .uppercase {
    text-transform: uppercase;
  }

  .labelpunch {
    width: 10%;
    text-align: right;
  }

  .labeltext {
    width: 100%;
  }

  .labelrow {
    margin:0;
  }

  .inlineblock {
    display: inline-block;
    margin:0;
  }

  span.padright {
    margin-right:1em;
  }

  span.padright-sm {
    margin-right:0.1em;
  }

  .floatright {
    float: right;
  }

  .floatleft {
    float: left;
  }

  .clearfloat {
    clear:both
  }

</style>