<script>
  import { getContext } from "svelte";
  import Label from './Label.svelte'

  const labelData = getContext('labelData')
  const appSettings = getContext('appSettings')
  const generalLabelSettings = getContext('generalLabelSettings')
  const herbariumLabelSettings = getContext('herbariumLabelSettings')
  
  let labelSettings
  if ($appSettings.labelType == 'general') {
    labelSettings = generalLabelSettings
  }
  if ($appSettings.labelType == 'herbarium') {
    labelSettings = herbariumLabelSettings
  }

</script>

<div class="label-cols" style="color:black; --label-width: { $labelSettings.labelWidth}cm"> 
  {#if $labelData.length}
    {#each $labelData as labelRecord}
      {#if $labelSettings.labelPerSpecimen && labelRecord.specimenCount }
        {#each Array(labelRecord.specimenCount) as i}
          <Label {labelRecord} />
        {/each}
      {:else}
        <Label {labelRecord} />
      {/if}
    {/each}
  {:else}
  No data to show, refresh to start over and choose a different file
  {/if}
</div>

<style>

  .label-cols {
    width: 100%;
    column-width: var(--label-width);
    column-gap: 1em;
    break-before: column;
  }

</style>