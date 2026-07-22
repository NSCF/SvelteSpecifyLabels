<script>
  import { getContext, onMount } from "svelte";
  import { pop, replace, push } from "svelte-spa-router";
  import Header from "../misc/Header.svelte";
  import CollectiveSettings from "../settings/CollectiveSettings.svelte";
  import LabelLayout from "../labels/LabelLayout.svelte";
  import { t } from "../../i18n/lang";
  import { saveSettings } from "../../lib/settingsManager";
  import { trackPageView, trackEvent } from "../../lib/analytics";

  const rawData = getContext("data");
  const labelData = getContext("labelData");
  const appSettings = getContext("appSettings");
  const generalLabelSettings = getContext("generalLabelSettings");
  const herbariumLabelSettings = getContext("herbariumLabelSettings");
  const entoLabelSettings = getContext("entoLabelSettings");
  const fieldMappings = getContext("mappings");

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

  if ($labelData.length == 0) {
    replace("/");
  }

  onMount(() => {
    trackPageView("/preview", $appSettings.labelType, $appSettings.lang);
  });

  const showPrint = (_) => {
    saveSettings(
      $appSettings,
      $generalLabelSettings,
      $herbariumLabelSettings,
      $entoLabelSettings,
      $fieldMappings,
    );

    let labelCount = $labelData.length;
    if ($labelSettings && $labelSettings.labelPerSpecimen) {
      labelCount = $labelData.reduce((sum, record) => {
        const count = parseInt(record.specimenCount, 10);
        return sum + (isNaN(count) || count <= 0 ? 1 : count);
      }, 0);
    }

    trackEvent("labels_generated", {
      label_count: labelCount,
      label_type: $appSettings.labelType,
      app_language: $appSettings.lang,
      browser_language: typeof navigator !== 'undefined' ? navigator.language : 'unknown'
    });
    window.print();
  };
</script>

<div class="print:hidden px-4">
  <Header />
  <div class="flex justify-between mt-2">
    <button id="back-button" class="btn btn-secondary" on:click={(_) => pop()}
      >{$t("back", "Back")}</button
    >
    <button
      on:click={showPrint}
      disabled={!$labelData.length}
      class="btn btn-primary"
      >{$t("printButton", "Let's print these labels...")}</button
    >
  </div>
  <div class="my-[1em]">
    <CollectiveSettings />
  </div>
</div>
<div class="px-4 print:px-0 print:mt-[1em]">
  <LabelLayout />
</div>
