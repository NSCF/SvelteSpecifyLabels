<script>

import { getContext, createEventDispatcher } from 'svelte'
import langs from "../i18n/lang";

const dispatch = createEventDispatcher()

const settings = getContext('settings')

</script>

<div style="display:flex; gap:3em;">
  {#if $settings.type == 'herbarium'}
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.labelsPerHerbariumSpecimen}>
    {langs['count'][$settings.lang]}
  </label>
  {:else}
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.labelPerSpecimen}>
    {langs['count'][$settings.lang]}
  </label>
  {/if}
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.excludeNoCatnums} on:change={_ => dispatch('calc_labels')}>
    {langs['excludeCatNums'][$settings.lang]}
  </label>
  <br/>
  <label style="display:inline">
    <input type=checkbox bind:checked={$settings.includeCollectorInSort} on:change={_ => dispatch('calc_labels')}>
    {langs['sortOnCollectors'][$settings.lang]}
  </label>
  <br/>
</div>