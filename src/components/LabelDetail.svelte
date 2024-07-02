<script>

  import { getContext } from "svelte";

  export let labelRecord

  const settings = getContext('settings')

  let labelDet = null
  $: if (labelRecord || $settings.includeTaxonAuthorities) getLabelDet()

  const getLabelDet = _ => {
    //BIG TODO move all this logic to the label mapping funcs, shouldnt be here. 
    //TODO add sensu when we have it

    if(labelRecord.labelDetName){
      labelDet = labelRecord.labelDetName
      if(!labelDet.includes(' sp.') && !labelDet.includes('?')) {
        if($settings.includeTaxonAuthorities && labelRecord.labelDetName == labelRecord.canonicalName && labelRecord.scientificNameAuthorship) {
          labelDet += ' ' + labelRecord.scientificNameAuthorship
        }
      }
    }
    else {
      if(labelRecord.canonicalName && labelRecord.canonicalName.trim()){
      
        let questionMark = false
        if(labelRecord.identificationConfidence){
          if(labelRecord.identificationConfidence.toLowerCase() != 'high'){
            questionMark = true
          }
        }

        if(labelRecord.identificationQualifier){
          if(['aff.', 'cf.', 'nr'].includes(labelRecord.identificationQualifier)){
            let nameParts = labelRecord.canonicalName.split(' ')
            if(nameParts.length > 1){
              let lastPart = nameParts.pop()
              nameParts.push(labelRecord.identificationQualifier)
              nameParts.push(lastPart)
              if(questionMark){
                nameParts.push('?')
              }
              else if(labelRecord.scientificNameAuthorship && $settings.includeTaxonAuthorities && !nameParts.includes('sp.')){
                nameParts.push(labelRecord.scientificNameAuthorship)
              }
              labelDet = nameParts.join(' ')
            }
            else {
              labelDet = [labelRecord.identificationQualifier, labelRecord.canonicalName].join(' ')
              if(questionMark){
                labelDet += ' ?'
              }
              else if (labelRecord.scientificNameAuthorship && $settings.includeTaxonAuthorities  && !labelDet.includes(' sp.')){
                labelDet += ` ${labelRecord.scientificNameAuthorship}`
              }
            }
          }
          else {
            labelDet = [labelRecord.canonicalName, labelRecord.identificationQualifier].join(' ')
          } 
        }
        else {
          labelDet = labelRecord.canonicalName
          if(questionMark) {
            labelDet += ' ?'
          }
          else if (labelRecord.scientificNameAuthorship && $settings.includeTaxonAuthorities && !labelDet.includes(' sp.')){
            labelDet += ` ${labelRecord.scientificNameAuthorship}`
          }
        }
      }
      else {

        labelDet = labelRecord.labelDetName

      }
    }

  }

</script>

<div class="label" style="--font-size: { $settings.fontSize + 'pt'};">
  {#if $settings.showStorage}
    {#if labelRecord.storageBox}
      <div style="padding:4px;">Box: {labelRecord.storageBox} -- cut this off label</div>
    {:else}
      <div style="padding:4px;">No storage recorded -- cut this off label</div>
    {/if}
    <hr class='subdiv' />
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
            <span class="floatleft"><strong>{labelRecord.catalogNumber}</strong></span>
            {#if labelRecord.collectorNumber}
              <span class="floatright inlineblock padright">{labelRecord.collectorNumber}</span>
            {/if}
          {:else}
          <span class="floatright inlineblock padright"><strong>{labelRecord.collectorNumber}</strong></span>
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
      <hr class='subdiv' />
      <div class="label-part">
        <div class="labeltext">
          <div class="inlineblock"><strong>Collecting events:</strong></div>
          {#if labelRecord.catalogNumber}
            <div class="floatright inlineblock padright"><strong>{labelRecord.catalogNumber}</strong></div>
          {:else}
            {#if labelRecord.collectorNumber}
              <div class="floatright inlineblock padright"><strong>{labelRecord.collectorNumber}</strong></div>
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
      <hr class='subdiv' />
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
        {#if labelRecord.catalogNumber}
        <div class="floatright inlineblock padright"><strong>{labelRecord.catalogNumber}</strong></div>
        {:else}
          {#if labelRecord.collectorNumber}
            <div class="floatright inlineblock padright"><strong>{labelRecord.collectorNumber}</strong></div>
          {/if}
        {/if}
        <div class="clearfloat">
          <!-- TODO if type then original name otherwise preferred name -->
          <span class="inlineblock">{labelDet}</span>
        </div>
        <div>
          {#if labelRecord.identifiedBy || labelRecord.dateIdentified}
            {#if labelRecord.acceptedName}
              <span>(accepted name: {labelRecord.acceptedName})</span><br/>
            {/if}
            <span>det: </span>
            <span >{labelRecord.identifiedBy || ''}</span>
            <span class="inlineblock">{labelRecord.dateIdentified || ''}</span>
          {:else}
          <!-- TODO if type then exclude this -->
            {#if labelRecord.acceptedName}
              <span>(accepted name: {labelRecord.acceptedName}; orig. det. conf. Jordaan & Steenkamp 2020)</span>
            {:else}
              <span>(orig. det. conf. Jordaan & Steenkamp 2020)</span>
            {/if}
          {/if}
        </div>
        <div>
          {labelRecord.identificationRemarks || ''}
        </div>
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
  {/if}
</div>


<!-- ################################# -->

<style>

  .label {
    font-family: 'Arial Narrow', 'PT Sans Narrow', Arial, sans-serif;
    font-size: calc(var(--font-size, 10pt) * 0.6);
    line-height: 95%;
    width: 100%;
    border-bottom: 0.5px solid black;
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
    text-transform: capitalize;
    font-size: var(--font-size, 1em);
    font-weight: bold;
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
    font-weight:bold;
    margin-bottom:.5em;
  }

  hr.subdiv {
    margin:0;
    border-top:0.5px dashed black;
  }

</style>