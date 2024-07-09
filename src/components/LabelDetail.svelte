<script>
  import CutMarks from "./CutMarks.svelte";
  import { getContext } from "svelte";
  import getLabelDet from '../lib/getLabelDet'

  export let labelRecord


  const settings = getContext('settings')

  let labelDet = null

  $: if (labelRecord || $settings.includeTaxonAuthorities) labelDet =  getLabelDet(labelRecord, $settings.includeTaxonAuthorities)

</script>

<div class="label" style="--font-size: { $settings.fontSize + 'pt'}; --label-width: { $settings.labelWidth + 'cm' };" >
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
        <div>
          {#if labelRecord.catalogNumber}
            <span class="floatleft" style="font-weight:bolder">{labelRecord.catalogNumber}</span>
            {#if labelRecord.recordNumber}
              <span class="floatright inlineblock padright" >{labelRecord.recordNumber}</span>
            {/if}
          {:else if labelRecord.recordNumber}
            <span class="floatright inlineblock padright" style="font-weight:bolder">{labelRecord.recordNumber}</span>
          {/if}
        </div>
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
            <span class='padright'>{labelRecord.collectionDate}</span>
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
            <span class="floatleft typestatus">{labelRecord.typeStatus}</span>
            {#if labelRecord.typeNumber}
              <span class="floatright">Type No:{labelRecord.typeNumber}</span>
            {/if}
          </div>
        {/if}
      </div>
    </div>
    {#if labelRecord.seriesSampleCounts && Array.isArray(labelRecord.seriesSampleCounts) && labelRecord.seriesSampleCounts.length > 1} <!--this is customized for label data from Arthrobase-->
      <CutMarks char={'-'} />
      <div class="label-part">
        <div class="labeltext">
          <div class="inlineblock" style="font-weight:bolder">Collecting events:</div>
          {#if labelRecord.catalogNumber}
            <div class="floatright inlineblock padright" style="font-weight:bolder">{labelRecord.catalogNumber}</div>
          {:else}
            {#if labelRecord.recordNumber}
              <div class="floatright inlineblock padright" style="font-weight:bolder">{labelRecord.recordNumber}</div>
            {/if}
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
        <div style="display:flex; justify-content:space-between">
          {#if labelRecord.typeStatus}
            <div class="typestatus">{labelRecord.typeStatus}</div>
          {:else if labelRecord.catalogNumber || labelRecord.recordNumber}
            <div /> <!-- a placeholder -->
          {/if}
          {#if labelRecord.catalogNumber}
            <div class="padright" style="font-weight:bolder">{labelRecord.catalogNumber}</div>
          {:else if labelRecord.recordNumber}
            <div class="padright" style="font-weight:bolder">{labelRecord.recordNumber}</div>            
          {/if}
        </div>
        <div class="clearfloat">
          <span class="inlineblock" style="font-weight: bolder">{labelDet}</span>
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
    font-family: "Roboto Condensed", 'Arial Narrow', 'PT Sans Narrow', Arial, sans-serif;
    font-size: calc(var(--font-size, 10pt) * 0.6);
    font-weight: 200;
    line-height: 98%;
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

  .typestatus {
    text-transform: uppercase;
    font-weight: bolder;
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
    margin-right:0.25em;
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
    font-weight:bolder;
    margin-bottom:.5em;
  }

</style>