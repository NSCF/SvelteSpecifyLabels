<script>
  import { getContext } from "svelte";
  import Label from './Label.svelte'

  const settings = getContext('settings')

  export let inputData = [
    {
      catalogNumber: 'NMSA-herp-0.1245',
      collectorNumber: 'WC02-2135',
      permitNumber: 'ACEFDSD1021457', 
      fullLocality: 'RSA;Northern Cape;Richtersveld;Tierhoek camp', 
      fullCoordsString: '-32.12454 18.24587±150m WGS84',
      habitat: 'Steep slopes with large granite boulders and course granitic soils',
      collectionDate: '2002-12-24',
      collectionMethod: 'rock flipping',
      recordedBy: 'Conradie, W.',
      count: 4
    },
    {
      catalogNumber: 'NMSA-herp-0.1232',
      fullLocality: 'RSA;Free State;Bloemfontein', 
      fullCoordsString: '28.32S 12.35E',
      collectionDate: '1904',
      recordedBy: 'Power',
    }
  ]

</script>

<!-- ################################# -->
<div class="cols" style="--label-width: { $settings.labelWidth + 'cm' }"> 
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
    column-width: var(--label-width, 5cm);
    column-gap: 1em;
    break-before: column;
  }

</style>