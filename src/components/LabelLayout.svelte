<script>
  import { getContext } from "svelte";
  import Label from './Label.svelte'

  const settings = getContext('settings')

  export let inputData

</script>

<div class="cols" style="color:black; --label-width: { $settings.type == 'general' ? $settings.labelWidth + 'cm' : '9cm' }"> 
  {#if inputData && inputData.length}
    {#each inputData as labelRecord}
      <Label {labelRecord} />
    {/each}
  {:else}
  No data to show, refresh to start over and choose a different file
  {/if}
</div>

<style>

  .cols {
    width: 100%;
    column-width: var(--label-width);
    column-gap: 1em;
    break-before: column;
  }

</style>