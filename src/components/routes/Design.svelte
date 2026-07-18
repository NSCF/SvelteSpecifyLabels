<script>
  import { getContext } from "svelte";
  import { push } from "svelte-spa-router";
  import Header from "../misc/Header.svelte";
  import LabelPreview from "../labels/LabelPreview.svelte";
  import GeneralLabelSettings from "../settings/GeneralLabelSettings.svelte";
  import HerbariumLabelSettings from "../settings/HerbariumLabelSettings.svelte";
  import EntoLabelSettings from "../settings/EntoLabelSettings.svelte";
  import getFieldMappings from "../../lib/getFieldMappings";
  import reconcileFieldMappings from "../../lib/reconcileFieldMappings";
  import makeLabel from "../../lib/toMakeOrNotToMakeLabel";
  import { t } from "../../i18n/lang";
  import exampleData from "../../exampleData";
  import exampleDataPlants from "../../exampleDataPlants";

  const rawData = getContext("data");
  const appSettings = getContext("appSettings");
  const generalLabelSettings = getContext("generalLabelSettings");
  const herbariumLabelSettings = getContext("herbariumLabelSettings");
  const entoLabelSettings = getContext("entoLabelSettings");
  const fieldMappings = getContext("mappings");
  const labelData = getContext("labelData");

  let labelSettings;
  if ($appSettings.labelType == "general") {
    labelSettings = generalLabelSettings;
  }
  if ($appSettings.labelType == "herbarium") {
    labelSettings = herbariumLabelSettings;
  }
  if ($appSettings.labelType == "insect") {
    labelSettings = entoLabelSettings;
  }

  if ($rawData.length == 0) {
    if ($appSettings.labelType == "herbarium") {
      $rawData = exampleDataPlants;
    } else {
      $rawData = exampleData;
    }
  }

  if (Object.keys($fieldMappings).length == 0) {
    const savedFieldMappingsJSON = localStorage.getItem("fieldMappings");
    if (savedFieldMappingsJSON) {
      let savedFieldMappings = JSON.parse(savedFieldMappingsJSON);
      if (!savedFieldMappings[$appSettings.labelType]) {
        savedFieldMappings = { [$appSettings.labelType]: savedFieldMappings };
      }
      reconcileFieldMappings(
        savedFieldMappings[$appSettings.labelType],
        $rawData[0],
      );
      $fieldMappings = savedFieldMappings;
    }
  }

  if (!$fieldMappings[$appSettings.labelType]) {
    $fieldMappings[$appSettings.labelType] = getFieldMappings($rawData[0]);
  }

  // it might be a completely new dataset and the previous mappings dont work, so we attempt to remap the fields
  $: if (
    $rawData.length > 0 &&
    $labelData.length > 0 &&
    !$labelData.some((record) => makeLabel(record, $labelSettings))
  ) {
    $fieldMappings[$appSettings.labelType] = getFieldMappings($rawData[0]);
  }

  const handleTypeChange = (_) => {
    if ($appSettings.labelType == "herbarium") {
      if ($rawData == exampleData) {
        $rawData = exampleDataPlants;
      }
    } else {
      if ($rawData == exampleDataPlants) {
        $rawData = exampleData;
      }
    }

    if (!$fieldMappings[$appSettings.labelType]) {
      const newFieldMappings = getFieldMappings($rawData[0]);
      $fieldMappings[$appSettings.labelType] = newFieldMappings;
    } else {
      reconcileFieldMappings(
        $fieldMappings[$appSettings.labelType],
        $rawData[0],
      );
    }
  };

  window.showData = (_) => {
    console.log($labelData);
  };

  //keep this in case
  // const reset = _ => {
  // 	if (localStorage.getItem("labelSettings") != null) {
  // 		const savedSettings = JSON.parse(localStorage.getItem("labelSettings"))
  // 		for (const [key, val] of Object.entries(savedSettings)) {
  // 			if (key in $settings) {
  // 				$settings[key] = val
  // 			}
  //       else if (key in defaultSettings) {
  //         $settings[key] = defaultSettings[key]
  //       }
  // 		}
  // 	}
  // }
</script>

<div class="h-[95vh] flex flex-col items-center">
  <Header />
  <div id="main" class="w-full max-w-[1280px] flex-auto min-h-0 flex">
    <div id="settings" class="flex items-center mr-[5px]">
      {#if $appSettings.labelType == "general"}
        <GeneralLabelSettings />
      {:else if $appSettings.labelType == "herbarium"}
        <HerbariumLabelSettings />
      {:else if $appSettings.labelType == "insect"}
        <EntoLabelSettings />
      {/if}
    </div>
    <div id="preview-section" class="relative w-full flex">
      <LabelPreview />
    </div>
  </div>
  <div class="w-full max-w-[1280px] flex justify-between border-t pt-2">
    <div>
      <button id="back-button" class="btn-secondary" on:click={(_) => push("/")}
        >{$t("startOver", "Start over")}</button
      >
      <button class="btn-secondary" on:click={(_) => push("/mappings")}
        >{$t("mappings", "Field mappings")}</button
      >
    </div>
    <button class="btn-primary" on:click={(_) => push("/preview")}
      >{$t("preview", "Preview and print")}</button
    >
  </div>
  <hr class="m-0" />
</div>
