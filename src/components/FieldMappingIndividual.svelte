<script>
  import { getContext } from "svelte";
  import darwinCoreFields from "../lib/dwcFields";
  import LinkIcon from "./LinkIcon.svelte";
  import CloseIcon from "./CloseIcon.svelte";
  import langs from "../i18n/lang";

  export let record
  export let labelField
  export let lang

  const fieldMappings = getContext('mappings')
  const settings = getContext('settings')

</script>

<label style="margin: auto; margin-bottom:1em; color: grey; display:flex; align-items:center">
  { darwinCoreFields.includes(labelField) ? 'dwc:' + labelField : labelField}
  {#if darwinCoreFields.includes(labelField)}
  <a style="position: relative; top: 4px;" href={"https://dwc.tdwg.org/terms/#dwc:" + labelField} target=”_blank”><LinkIcon /></a>
  {/if}
  <select style="display: inline; color: black; margin:0; margin-left:1em;" bind:value={$fieldMappings[$settings.type][labelField]}>
    <option value="">{langs['remove'][lang]}</option>
    {#each Object.keys(record) as datasetField}
    <option value={datasetField}>{datasetField}</option>
    {/each}
  </select>
  <button class="close-button" on:click={_ => $fieldMappings[$settings.type][labelField] = null}><CloseIcon/></button>
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
