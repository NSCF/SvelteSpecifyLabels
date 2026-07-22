<script>
  import { createEventDispatcher, getContext } from "svelte";
  import darwinCoreFields from "../../lib/dwcFields";
  import LinkIcon from "../misc/LinkIcon.svelte";
  import CloseIcon from "../misc/CloseIcon.svelte";
  import { t } from "../../i18n/lang";

  const dispatch = createEventDispatcher();

  export let record;
  export let labelField;

  const fieldMappings = getContext("mappings");
  const appSettings = getContext("appSettings");

  const handleCloseClick = (_) => {
    $fieldMappings[$appSettings.labelType][labelField] = null;
    dispatch("mapping-change");
  };
</script>

<label class="m-auto mb-[1em] text-[grey] flex items-center">
  {darwinCoreFields.includes(labelField) ? "dwc:" + labelField : labelField}
  {#if darwinCoreFields.includes(labelField)}
    <a
      class="relative top-[4px] fill-[#617E3E] hover:fill-[#043B58]"
      href={"https://dwc.tdwg.org/terms/#dwc:" + labelField}
      target="”_blank”"><LinkIcon /></a
    >
  {/if}
  <select
    class="inline text-black m-0 ml-[1em]"
    bind:value={$fieldMappings[$appSettings.labelType][labelField]}
    on:change={(_) => dispatch("mapping-change")}
  >
    <option value="">{$t("remove", "remove")}</option>
    {#each Object.keys(record) as datasetField}
      <option value={datasetField}>{datasetField}</option>
    {/each}
  </select>
  <button
    class="m-0 p-0 bg-transparent border-none"
    on:click={handleCloseClick}
    title={$t("remove", "remove")}
    aria-label={$t("remove", "remove")}
    ><CloseIcon /></button
  >
</label>
