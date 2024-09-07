<script>

import { getContext, createEventDispatcher } from 'svelte'
import langs from "../../i18n/lang";

const dispatch = createEventDispatcher()

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

<div style="display:flex; gap:3em;">
  <label style="display:inline">
    <input type=checkbox bind:checked={$labelSettings.labelPerSpecimen}>
    {langs['count'][$appSettings.lang]}
  </label>
  <label style="display:inline">
    <input type=checkbox bind:checked={$labelSettings.excludeNoCatnums} on:change={_ => dispatch('calc_labels')}>
    {langs['excludeCatNums'][$appSettings.lang]}
  </label>
  <br/>
  <label style="display:inline">
    <input type=checkbox bind:checked={$labelSettings.includeCollectorInSort} on:change={_ => dispatch('calc_labels')}>
    {langs['sortOnCollectors'][$appSettings.lang]}
  </label>
  <br/>
</div>