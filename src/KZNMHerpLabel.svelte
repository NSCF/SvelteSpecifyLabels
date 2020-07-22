<script>

export let record

</script>

<!-- ################################# -->

<div class="label">
  <div>
    <span class="floatleft"><strong>{record.catalogNumber}</strong></span>
    <span class="floatright">{record.collectorNumber || ''}&nbsp;&nbsp;</span>
  </div>
  <div class="labelrow clearfloat">
    {record.fullLocality}&nbsp;&nbsp;
    <span class="inlineblock">{record.fullCoordsString || ''}</span>
  </div>
  
  <div class="labelrow">{record.habitat || ''}</div>
  <div class="labelrow">
    {#if record.collectionDate && record.collectionDate.toString().trim()}
      <span>{record.collectionDate}</span>&nbsp;&nbsp;
    {/if}
    {#if record.permitNumber && record.permitNumber.toString().trim()}
      <span>Permit:&nbsp;{record.permitNumber}</span>&nbsp;&nbsp;
    {/if}
    {#if record.recordedBy && record.recordedBy.toString().trim()}
      <span class="inlineblock">{record.recordedBy}</span>
    {/if}  
  </div>
  {#if record.count && !isNaN(record.count) && record.count > 1}
    <div>
      Specimens:&nbsp;{record.count}&nbsp;&nbsp;
      <span class="inlineblock">{record.collectionMethod || ''}</span>
    </div>
  {/if}
</div>

<!-- ################################# -->

<style>
.label {
  font-family: 'Arial Narrow, PT Sans Narrow, Arial, sans-serif';
  font-size:0.6em;
  line-height: 95%;
  width: 5cm;
  border-bottom: 0.5px dashed black;
  padding-top:3px;
  padding-bottom:3px;
  break-inside:avoid;
  min-height: 2cm;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.labelrow {
  margin:0;
}

.inlineblock {
  display: inline-block;
  margin:0;
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