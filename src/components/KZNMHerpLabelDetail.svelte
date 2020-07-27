<script>
export let labelRecord
export let showInstitution = false
export let collectionName
export let detLabel = true
export let includePunch = true


</script>

<div class="label">
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
        {#if labelRecord.collectorNumber && labelRecord.collectorNumber.trim()}
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
        {#if labelRecord.collectionDate && labelRecord.collectionDate.toString().trim()}
          <span class='padright'>{labelRecord.collectionDate}</span>
        {/if}
        {#if labelRecord.recordedBy && labelRecord.recordedBy.length}
          {#each labelRecord.recordedBy as coll}
            <span class="inlineblock padright-sm">{coll}</span>
          {/each}
        {/if}
        {#if labelRecord.permitNumber && labelRecord.permitNumber.toString().trim()}
          <span class="inlineblock padleft">Permit:&nbsp;{labelRecord.permitNumber}</span>
        {/if}  
        {#if labelRecord.collectionMethod && labelRecord.collectionMethod.trim()}
          <span class="inlineblock padleft">{labelRecord.collectionMethod}</span>
        {/if}
      </div>
      {#if labelRecord.specimenCount && !isNaN(labelRecord.specimenCount) && labelRecord.specimenCount > 1}
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
      {#if showInstitution}
        <div class="museumname">
          <span>{collectionName}</span>
        </div>
      {/if}
    </div>
  </div>
  {#if detLabel && labelRecord.labelDetName}
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
        <span style="width:100%;text-align:right"><strong>{labelRecord.catalogNumber}</strong></span>
        <div class="clearfloat">{labelRecord.labelDetName}</div>
        <div>
          {#if labelRecord.detBy || labelRecord.detDate || labelRecord.detMethod}
            det:&nbsp;
            <span >{labelRecord.detBy || ''}</span>
            <span class="inlineblock">{labelRecord.detDate || ''}</span>
            <span class="inlineblock">{labelRecord.detMethod || ''}</span>
          {:else}
            (No det data)
          {/if}
        </div>
      </div>
      
    </div>
  {/if}
</div>

<!-- ################################# -->

<style>
.label {
  font-family: 'Arial Narrow', 'PT Sans Narrow', Arial, sans-serif;
  font-size:0.8em;
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

.labelpunch {
  width: 10%;
  text-align: center;
}
.labeltext {
  width: 80%;
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