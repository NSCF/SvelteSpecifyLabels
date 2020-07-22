<script>
import { afterUpdate } from 'svelte';
import KZNMHerpLabel from './KZNMHerpLabel.svelte'

export let labelData = [
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
    catalogNumber: 'NMSA-herp-0.1245',
    fullLocality: 'RSA;Free State;Bloemfontein', 
    fullCoordsString: '28.32S 12.35E',
    collectionDate: '1904',
    recordedBy: 'Power',
  }
]


afterUpdate(() => {
  //window.print()
});

</script>

<!-- ################################# -->
<div class="cols"> 
  {#each labelData as r}
    {#each Array(r.count || 1) as _, i}
      <KZNMHerpLabel record={r}/>
    {/each}
  {/each}
</div>

<!-- ################################# -->
<style>

hr {
  margin: 0;
}

.cols {
  column-width: 5cm;
  column-gap: 0.1em;
  break-before: column;
}




</style>