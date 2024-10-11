<script>
  import { createEventDispatcher, getContext } from "svelte";
  import darwinCoreFields from "../../lib/dwcFields";
  import LinkIcon from "../misc/LinkIcon.svelte";
  import CloseIcon from "../misc/CloseIcon.svelte";
  import langs from "../../i18n/lang";

  const dispatch = createEventDispatcher()

  export let record
  export let labelField
  export let lang

  const fieldMappings = getContext('mappings')
  const appSettings = getContext('appSettings')

  const handleCloseClick = _ => {
    $fieldMappings[$appSettings.labelType][labelField] = null
    dispatch('mapping-change')
  }

</script>

<label style="margin: auto; margin-bottom:1em; color: grey; display:flex; align-items:center">
  { darwinCoreFields.includes(labelField) ? 'dwc:' + labelField : labelField}
  {#if darwinCoreFields.includes(labelField)}
  <a style="position: relative; top: 4px;" href={"https://dwc.tdwg.org/terms/#dwc:" + labelField} target=”_blank”><LinkIcon /></a>
  {/if}
  <select style="display: inline; color: black; margin:0; margin-left:1em;" bind:value={$fieldMappings[$appSettings.labelType][labelField]} on:change={_ => dispatch('mapping-change')}>
    <option value="">{langs['remove'][lang]}</option>
    {#each Object.keys(record) as datasetField}
    <option value={datasetField}>{datasetField}</option>
    {/each}
  </select>
  <button class="close-button" on:click={handleCloseClick}><CloseIcon/></button>
</label>

<style>
  .close-button {
    margin:0;
    padding: 0;
    background-color: transparent;
    border: none;
    margin-top: 8px;
  }

  a {
    fill: #617E3E;
  }

  a:hover {
    fill: #043B58;
  }
</style>
