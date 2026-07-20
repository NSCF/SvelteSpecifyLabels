<script>
  import { getContext, createEventDispatcher } from "svelte";
  import NumberInput from "./NumberInput.svelte";
  import { t } from "../../i18n/lang";
  import CheckboxSetting from "./CheckboxSetting.svelte";

  const dispatch = createEventDispatcher();

  const appSettings = getContext("appSettings");
  const labelSettings = getContext("entoLabelSettings");

  const fonts = [
    "Roboto Condensed",
    "Courier",
    "PT Sans Narrow",
    "Times New Roman",
    "Arial",
  ];

  const fontWeights = {
    "Roboto Condensed": [100, 200, 300, 400],
  };

  $: if (!($labelSettings.font in fontWeights)) $labelSettings.fontWeight = 400;

  // Sizes mapper: mm to cm
  const sizeOptions = [
    { label: "10 x 6 mm", value: "10x6", width: 1.0, height: 0.6 },
    { label: "15 x 7 mm", value: "15x7", width: 1.5, height: 0.7 },
    { label: "18 x 8 mm", value: "18x8", width: 1.8, height: 0.8 },
    { label: "20 x 9 mm", value: "20x9", width: 2.0, height: 0.9 },
    { label: "22 x 15 mm", value: "22x15", width: 2.2, height: 1.5 },
  ];

  const handleSizeChange = (e) => {
    const selected = sizeOptions.find(
      (opt) => opt.value === $labelSettings.labelSize,
    );
    if (selected) {
      $labelSettings.labelWidth = selected.width;
      $labelSettings.labelHeight = selected.height;
    }
  };
</script>

<div class="w-full flex flex-col">
  <div
    class="w-full mt-[2em] [column-count:2] [column-width:50%] gap-[1em] mb-[1em]"
  >
    <CheckboxSetting
      bind:value={$labelSettings.detLabel}
      labelText={$t("dets", "Include det labels")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.detLabelOnly}
      labelText={$t("detsOnly", "Make det labels only")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.includeBarcode}
      labelText={$t("barcode", "Include barcode")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.includeQRCode}
      labelText={$t("qrCode", "Include QR code")}
    />
    {#if $labelSettings.labelSize === "22x15"}
      <CheckboxSetting
        bind:value={$labelSettings.barcodeOnMain}
        labelText={$t("barcodeOnMain", "Include barcode on main label")}
      />
    {/if}
    <CheckboxSetting
      bind:value={$labelSettings.includeStageSexOnMainLabel}
      labelText={$t("stageSexOnMain", "Include stage/sex on main label")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.includeTaxonAuthorities}
      labelText={$t("authors", "Include taxon authorities")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.includeFieldNumber}
      labelText={$t("fieldNumber", "Include field number")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.underline}
      labelText={$t("underline", "Underline, not bold")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.italics}
      labelText={$t("italics", "Italics for scientific names")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.borderForTypes}
      labelText={$t("borderForTypes", "Red border on det label for types")}
    />
  </div>
  <div class="flex gap-[5px] flex-wrap items-end mb-[5px]">
    <div class="flex flex-col">
      <label for="ento-label-size" class="block whitespace-nowrap"
        >{$t("labelSize", "Label size")}</label
      >
      <select
        id="ento-label-size"
        bind:value={$labelSettings.labelSize}
        on:change={handleSizeChange}
      >
        {#each sizeOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="flex gap-[5px] items-end mb-[5px]">
    <div class="flex flex-col">
      <label for="fonts" class="block whitespace-nowrap"
        >{$t("font", "Font")}</label
      >
      <select id="fonts" bind:value={$labelSettings.font}>
        {#each fonts as font}
          <option value={font}>{font}</option>
        {/each}
      </select>
    </div>
    {#if $labelSettings.font in fontWeights}
      <div class="flex flex-col">
        <label for="font-weight" class="block whitespace-nowrap"
          >{$t("fontWeight", "Font weight")}</label
        >
        <select id="font-weight" bind:value={$labelSettings.fontWeight}>
          {#each fontWeights[$labelSettings.font] as weightOption}
            <option value={weightOption}>{weightOption}</option>
          {/each}
        </select>
      </div>
    {/if}
    <div>
      <NumberInput
        id="font-size"
        labelString={$t("fontSize", "Font size")}
        min={3}
        max={6}
        step={0.5}
        bind:value={$labelSettings.fontSize}
      />
    </div>
    <div>
      <NumberInput
        id="line-height"
        labelString={$t("lineHeight", "Line height")}
        min={90}
        max={120}
        step={5}
        bind:value={$labelSettings.lineHeight}
      />
    </div>
  </div>
  <div class="flex gap-[5px] flex-wrap items-end"></div>
  <p class="relative m-0 mt-[10px] text-[0.7em] text-gray-400">
    {$t("saveSettings", "Settings are saved when you preview/print")}
  </p>
  <br />
</div>
