<script>
  import { getContext } from "svelte";
  import { t } from "../../i18n/lang";

  const appSettings = getContext("appSettings");
  const generalLabelSettings = getContext("generalLabelSettings");
  const herbariumLabelSettings = getContext("herbariumLabelSettings");

  let labelSettings;
  if ($appSettings.labelType == "general") {
    labelSettings = generalLabelSettings;
  }
  if ($appSettings.labelType == "herbarium") {
    labelSettings = herbariumLabelSettings;
  }
</script>

<div class="flex gap-[3em]">
  <label class="inline">
    <input type="checkbox" bind:checked={$labelSettings.labelPerSpecimen} />
    {$t("count", "Duplicate labels using count")}
  </label>
  <label class="inline">
    <input type="checkbox" bind:checked={$labelSettings.excludeNoCatnums} />
    {$t(
      "excludeCatNums",
      "Exclude records with no catalog or collector numbers",
    )}
  </label>
  <br />
  <label class="inline">
    <input
      type="checkbox"
      bind:checked={$labelSettings.includeCollectorInSort}
    />
    {$t("sortOnCollectors", "Include collector names in sort")}
  </label>
  <br />
</div>