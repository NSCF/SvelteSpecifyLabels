<script>
  import { onMount, getContext } from "svelte";
  import { pop, push, replace } from "svelte-spa-router";
  import LabelPreview from "../labels/LabelPreview.svelte";
  import FieldMappingIndividual from "../fieldMappings/FieldMappingIndividual.svelte";
  import FieldMappingSelect from "../fieldMappings/FieldMappingSelect.svelte";
  import getFieldMappings from "../../lib/getFieldMappings";
  import { t } from "../../i18n/lang";

  const rawData = getContext("data");
  const appSettings = getContext("appSettings");
  const generalLabelSettings = getContext("generalLabelSettings");
  const herbariumLabelSettings = getContext("herbariumLabelSettings");
  const fieldMappings = getContext("mappings");
  const labelData = getContext("labelData");

  const abbreviateCountries =
    $appSettings.labelType == "general" || $appSettings.labelType == "insect";

  let show = true; // this is a bit of a hack because replace is async
  let labelSettings;
  let bottomDiv;
  let hideBottomDiv = true;
  let dontShowAgain = false;
  let labelPreviewHeight;
  let mainDiv; //for getting the width...
  let mainWidth;

  // deprecated fields
  const excludeFromMappings = [
    "detByLast",
    "detByFirst",
    "detByInitials",
    "fullLocality",
    "fullCoordsString",
    "llunit",
    "ns",
    "ew",
  ];

  if ($appSettings.labelType == "general") {
    labelSettings = generalLabelSettings;
  }
  if ($appSettings.labelType == "herbarium") {
    labelSettings = herbariumLabelSettings;
  }

  if ($appSettings.labelType == "herbarium") {
    if ($labelSettings.labelSize == "standard") {
      labelPreviewHeight = "11cm";
    } else {
      labelPreviewHeight = "14cm";
    }
  } else {
    labelPreviewHeight = "10cm";
  }

  // to catch a page refresh
  if (!$fieldMappings || !$rawData.length) {
    show = false;
    replace("/");
  }

  const autoMap = (_) => {
    $fieldMappings[$appSettings.labelType] = getFieldMappings($rawData[0]);
  };

  const clearMappings = (_) => {
    for (const key of Object.keys($fieldMappings[$appSettings.labelType])) {
      $fieldMappings[$appSettings.labelType][key] = null;
    }
    $fieldMappings = $fieldMappings;
  };

  const getHideBottomDiv = (_) => {
    if (bottomDiv) {
      let gap = window.innerHeight - bottomDiv.getBoundingClientRect().bottom;
      hideBottomDiv = gap > 50;
    }
  };

  const scrollBottom = (_) => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Optional: Add smooth scrolling effect
    });
    dontShowAgain = true;
  };

  const handleMappingChange = (_) => {};
</script>

<svelte:document on:scroll={(_) => (dontShowAgain = true)} />
<div class="max-w-[1280px] mx-auto" bind:this={mainDiv}>
  {#if show}
    <h2>{$t("mappings", "Field mappings")}</h2>
    <p class="max-w-[1000px]">
      {$t(
        "mappingHelp",
        "Each mapping on this page shows a label field and the mapped field from your dataset. Not all fields are required; simply map your dataset fields to the label fields that make sense and see how they appear",
      )}
    </p>
    <div class="flex justify-between">
      <button id="back-button" class="btn btn-secondary" on:click={(_) => pop()}
        >{$t("back", "Back")}</button
      >
      <button class="btn btn-primary" on:click={(_) => push("/preview")}
        >{$t("preview", "Preview and print")}</button
      >
    </div>
    <div
      class="mx-auto"
      style="width:{$labelSettings.labelWidth}cm; height: {labelPreviewHeight}"
    >
      <LabelPreview on:label-rendered={getHideBottomDiv} />
    </div>
    <div
      class="w-full flex justify-between items-center mb-[2em]"
      bind:this={bottomDiv}
    >
      <FieldMappingSelect
        record={$rawData[0]}
        {excludeFromMappings}
        on:mapping-change={handleMappingChange}
      />
      <div>
        <button class="btn btn-secondary" on:click={clearMappings}
          >{$t("clear-mappings", "Clear mappings")}</button
        >
        <button class="btn btn-secondary" on:click={autoMap}
          >{$t("autoMap", "Auto map")}</button
        >
      </div>
    </div>
    <div class="flex w-full flex-wrap">
      {#each Object.keys($fieldMappings[$appSettings.labelType]) as labelField}
        {#if $fieldMappings[$appSettings.labelType][labelField] && !excludeFromMappings.includes(labelField)}
          <FieldMappingIndividual
            record={$rawData[0]}
            {labelField}
            on:mapping-change={handleMappingChange}
          />
        {/if}
      {/each}
    </div>
    <div
      class="{hideBottomDiv || dontShowAgain
        ? 'invisible'
        : ''} fixed bottom-0 flex justify-center"
      style="width:{mainDiv ? mainDiv.offsetWidth + 'px' : '100%'};"
    >
      <button class="down-arrow" on:click={scrollBottom}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#5f6368"
          ><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg
        >
      </button>
    </div>
  {/if}
</div>
