<script>
export let labelRecord
export let showInstitution = false
export let collectionName
export let detLabel = true
export let includePunch = true
export let includeTaxonAuthorities = false
export let authorities

let labelDet = null
$: includeTaxonAuthorities, getLabelDet()

const getLabelDet = _ => {
  //TODO add sensu when we have it

  if(includeTaxonAuthorities) {
    if(!labelRecord.scientificNameAuthorship || !labelRecord.scientificNameAuthorship.trim()){
      if(authorities[labelRecord.canonicalName]){
        labelRecord.scientificNameAuthorship = authorities[labelRecord.canonicalName]
      }
    }
  }

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
          else if(labelRecord.scientificNameAuthorship && includeTaxonAuthorities){
            nameParts.push(labelRecord.scientificNameAuthorship)
          }
          labelDet = nameParts.join(' ')
        }
        else {
          labelDet = [labelRecord.identificationQualifier, labelRecord.canonicalName].join(' ')
          if(questionMark){
            labelDet += ' ?'
          }
          else if (labelRecord.scientificNameAuthorship && includeTaxonAuthorities){
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
      else if (labelRecord.scientificNameAuthorship && includeTaxonAuthorities){
        labelDet += ` ${labelRecord.scientificNameAuthorship}`
      }
    }
  }
}

</script>
<div class="label">
  <div style="padding:4px;">Box: {labelRecord.storageBox} -- cut this off label</div>
  <hr class='subdiv'>
  <div class="label-part">
    {#if includePunch}
      <div class="labelpunch">
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="2" fill="black" />
        </svg> 
      </div>
    {/if}
    <div class="labeltext">
      <div>
        <span class="floatleft"><strong>{labelRecord.catalogNumber}</strong></span>
        {#if labelRecord.collectorNumber}
          <span class="floatright inlineblock padright">CollNo:{labelRecord.collectorNumber}</span>
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
          <span class="inlineblock padleft">Permit:&nbsp;{labelRecord.permitNumber}</span>
        {/if}  
        {#if labelRecord.collectionMethod}
          <span class="inlineblock padleft">{labelRecord.collectionMethod}</span>
        {/if}
      </div>
      {#if labelRecord.specimenCount}
        <div>
          <span class="padright">Specimens:&nbsp;{labelRecord.specimenCount}</span>
          {#if labelRecord.specimenStageSex}
            <span class="inlineblock">({labelRecord.specimenStageSex})</span>
          {/if}
        </div>
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
      {#if showInstitution}
        <div class="museumname">
          <span>{collectionName}</span>
        </div>
      {/if}
    </div>
  </div>
  {#if detLabel && detLabel} <!-- Apoligies to readers for these, detLabel flags whether to add the label, label det is what goes on the label -->
    <hr class='subdiv'>
    <div class="label-part">
      {#if includePunch}
        <div class="labelpunch">
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="2" fill="black" />
          </svg> 
        </div>
      {/if}
      <div class="labeltext">
        <div style="width:100%;text-align:right">
          <span ><strong>{labelRecord.catalogNumber}</strong></span>
        </div>
        <div>
          <!-- TODO if type then original name otherwise preferred name -->
          <span class="inlineblock">{labelDet}</span>
        </div>
        <div>
          {#if labelRecord.identifiedBy || labelRecord.dateIdentified || labelRecord.identificationMethod}
            det:&nbsp;
            <span >{labelRecord.identifiedBy || ''}</span>
            <span class="inlineblock">{labelRecord.dateIdentified || ''}</span>
            <span class="inlineblock">{labelRecord.identificationMethod || ''}</span>
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
  font-size:0.7em;
  line-height: 95%;
  width: 5cm;
  border-bottom: 0.5px solid black;
  break-inside:avoid;
}

.label-part {
  display:flex;
  flex-direction: row;
  align-items: center;
  padding-top:3px;
  padding-bottom:3px;
  min-height: 2cm;
}

.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

.typestatus {
  text-transform: capitalize;
  font-size: 1em;
  font-weight: bold;
}
.labelpunch {
  width: 10%;
  text-align: right;
}
.labeltext {
  width: 90%;
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

span.padleft {
  margin-left:0.25em;
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
  font-weight:bold
}

hr.subdiv {
  margin:0;
  border-top:0.5px dashed black;
}


</style>