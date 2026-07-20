<script>
  import { getContext } from "svelte";
  import { pop, replace, push } from "svelte-spa-router";
  import Header from "../misc/Header.svelte";
  import CollectiveSettings from "../settings/CollectiveSettings.svelte";
  import LabelLayout from "../labels/LabelLayout.svelte";
  import { t } from "../../i18n/lang";

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

  const showPrint = (_) => {
    localStorage.setItem("appSettings", JSON.stringify($appSettings));
    localStorage.setItem(
      "generalLabelSettings",
      JSON.stringify($generalLabelSettings),
    );
    localStorage.setItem(
      "herbariumLabelSettings",
      JSON.stringify($herbariumLabelSettings),
    );
    localStorage.setItem(
      "entoLabelSettings",
      JSON.stringify($entoLabelSettings),
    );
    localStorage.setItem("fieldMappings", JSON.stringify($fieldMappings));
    window.print();
  };
</script>

<div class="print:hidden">
  <Header />
  <div class="flex justify-between mt-2">
    <button id="back-button" class="btn-secondary" on:click={(_) => pop()}
      >{$t("back", "Back")}</button
    >
    <button
      on:click={showPrint}
      disabled={!$labelData.length}
      class="btn-primary"
      >{$t("printButton", "Let's print these labels...")}</button
    >
  </div>
  <div class="my-[1em]">
    <CollectiveSettings />
  </div>
</div>
<div class="print:mt-[1em]">
  <LabelLayout />
</div>
