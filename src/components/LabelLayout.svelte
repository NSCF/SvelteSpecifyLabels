<script>
  import { getContext } from "svelte";
  import Label from './Label.svelte'

  const labelData = getContext('labelData')
  const settings = getContext('settings')
  let labelWidth = '9cm'

  const multipleLabels = labelRecord => {
    return ($settings.type == 'herbarium' && $settings.labelsPerHerbariumSpecimen && labelRecord.specimenCount) || 
      ($settings.type != 'herbarium' && $settings.labelPerSpecimen && labelRecord.specimenCount)
  }

  const getLabelWidth = _ => {
    if ($settings.type == 'general') {
      return $settings.labelWidth + 'cm'
    }
    else {
      return '9cm'
    }
  }

  $: $settings.type, labelWidth = getLabelWidth()

</script>

<div class="label-cols" style="color:black; --label-width: { labelWidth }"> 
  {#if $labelData.length}
    {#each $labelData as labelRecord}
      {#if $settings.labelsPerHerbariumSpecimen || $settings.labelPerSpecimen || multipleLabels(labelRecord) }
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