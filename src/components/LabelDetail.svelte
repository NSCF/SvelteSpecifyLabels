<script>
  import CutMarks from "./CutMarks.svelte";
  import { getContext } from "svelte";
  import getLabelDet from '../lib/getLabelDet'
  import QRCode from 'qrcode'

  export let labelRecord


  const settings = getContext('settings')

  let labelDet = null
  let canvas
  let img

  $: if (labelRecord || $settings.includeTaxonAuthorities || $settings.italics) labelDet =  getLabelDet(labelRecord, $settings.includeTaxonAuthorities, false, $settings.italics)

  $: if($settings.includeQRCode && img && labelRecord && labelRecord.catalogNumber) {
    QRCode.toDataURL(labelRecord.catalogNumber, { margin: 0 }, function (error, url) {
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

</script>

<div class="label" 
  style="--font: {$settings.font}; 
  --font-weight: {$settings.fontWeight};
  --font-size: { $settings.fontSize + 'pt'}; 
  --line-height: {$settings.lineHeight + '%'};
  --label-width: { $settings.labelWidth + 'cm' };
  " >
  {#if $settings.showStorage}
    {#if labelRecord.storageBox}
      <div style="padding:4px;">Box: {labelRecord.storageBox} -- cut this off label</div>
    {:else}
      <div style="padding:4px;">No storage recorded -- cut this off label</div>
    {/if}
    <CutMarks char={'-'}/>
  {/if}
  {#if !$settings.detLabelOnly}
    <div class="label-part">
      {#if $settings.includePunch}
        <div class="labelpunch">
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="2" fill="black" />
          </svg> 
        </div>
      {/if}
      <div class="labeltext">
        {#if $settings.showInstitution}
          <div class="museumname">
            <span>{$settings.collectionName}</span>
          </div>
        {/if}
        {#if labelRecord.catalogNumber || labelRecord.recordNumber || labelRecord.fieldNumber}
        <div style="display:flex; flex-direction:row-reverse; justify-content:space-between;margin-right:1em">
          {#if labelRecord.recordNumber || labelRecord.fieldNumber}
          <div class:bolder={!labelRecord.catalogNumber && !$settings.underline} class:underline={!labelRecord.catalogNumber && $settings.underline}>
            {#if $settings.includeFieldNumber && labelRecord.fieldNumber}
            <span>{labelRecord.fieldNumber}{labelRecord.recordNumber? ' / ' : ''}</span>
            {/if}
            <span>{labelRecord.recordNumber}</span>
          </div>
          {/if}
          {#if labelRecord.catalogNumber}
          <div class:bolder={!$settings.underline} class:underline={$settings.underline}>{labelRecord.catalogNumber}</div>
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
          {#if labelRecord.fullCoordsString}
            <span class="inlineblock">{labelRecord.fullCoordsString}</span>
          {/if}    
        </div>
        <div class="labelrow">{labelRecord.habitat || ''}</div>
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
        <div>{labelRecord.occurrenceRemarks || ''}</div>
        {#if labelRecord.typeStatus}
          <div class="clearfix">
            <span class="floatleft uppercase">{labelRecord.typeStatus}</span>
            {#if labelRecord.typeNumber}
              <span class="floatright">Type No:{labelRecord.typeNumber}</span>
            {/if}
          </div>
        {/if}
        {#if $settings.addPrintedDate}
        <div class:bolder={!$settings.underline} class:underline={$settings.underline} >Printed on {$settings.printerModel ? $settings.printerModel : ''} {getPrintDateString()}</div>
        {/if}
        {#if labelRecord.project && $settings.includeProject}
        <div class:bolder={!$settings.underline} class:underline={$settings.underline} >{labelRecord.project}</div>
        {/if}
      </div>
      {#if $settings.includeQRCode && labelRecord.catalogNumber}
        <div style="margin:.25em;">
          <img width="35" height="35" bind:this={img} alt="QR code"/>
        </div>
      {/if}
    </div>
    {/if}
    {#if labelRecord.seriesSampleCounts && Array.isArray(labelRecord.seriesSampleCounts) && labelRecord.seriesSampleCounts.length > 1} <!--this is customized for label data from Arthrobase-->
      <CutMarks char={'-'} />
      <div class="label-part">
        <div class="labeltext">
          <div class="inlineblock" class:bolder={!$settings.underline} class:underline={$settings.underline}>Collecting events:</div>
          {#if labelRecord.catalogNumber || labelRecord.recordNumber || labelRecord.fieldNumber}
          <div style="display:flex; flex-direction:row-reverse; justify-content:space-between;margin-right:1em">
            {#if labelRecord.recordNumber}
            <div class:bolder={!labelRecord.catalogNumber && !$settings.underline} class:underline={!labelRecord.catalogNumber && $settings.underline}>
              {#if $settings.includeFieldNumber && labelRecord.fieldNumber}
              <span>{labelRecord.fieldNumber}{labelRecord.recordNumber? ' / ' : ''}</span>
              {/if}
              <span>{labelRecord.recordNumber}</span>
            </div>
            {/if}
            {#if labelRecord.catalogNumber}
            <div class:bolder={!$settings.underline} class:underline={$settings.underline}>{labelRecord.catalogNumber}</div>
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
  {#if ($settings.detLabel || $settings.detLabelOnly) && labelDet} <!-- Apologies to readers for these, detLabel flags whether to add the label, labelDet is what goes on the label -->
    {#if !$settings.detLabelOnly}
    <CutMarks char={'-'}/>
    {/if}
    <div class="label-part det-label">
      {#if $settings.includePunch}
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
            <div class:bolder={!$settings.underline} class:underline={$settings.underline}>{labelRecord.catalogNumber}</div>
          {:else if labelRecord.recordNumber || labelRecord.fieldNumber}
            <div class:bolder={!$settings.underline} class:underline={$settings.underline}>
              {#if $settings.includeFieldNumber && labelRecord.fieldNumber}
              <span>{labelRecord.fieldNumber}{labelRecord.recordNumber ? ' / ' : ''}</span>
              {/if}
              <span>{labelRecord.recordNumber}</span>
            </div>            
          {/if}
        </div>
        <div class="clearfloat">
          <span class="inlineblock" class:bolder={!$settings.underline} class:underline={$settings.underline}>{@html labelDet}</span>
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
    </div>
  {/if}
  <CutMarks char={'—'}/>
</div>


<!-- ################################# -->

<style>

  .label {
    position: relative;
    font-family: var(--font, sans-serif);
    font-size: calc(var(--font-size, 10pt));
    font-weight: var(--font-weight, 400);
    line-height: var(--line-height, 105%);
    width: var(--label-width, 5cm);
    /* border-bottom: 0.5px solid black; */
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

  .museumname {
    text-align:center;
    margin-bottom:.5em;
  }

</style>