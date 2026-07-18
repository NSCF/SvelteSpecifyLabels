<script>
  import { getContext, createEventDispatcher } from "svelte";
  import NumberInput from "./NumberInput.svelte";
  import { t } from "../../i18n/lang";
  import numberInputSettings from "../../settings/numberInputSettings";
  import hasArialNarrow from "../../lib/hasArialNarrow";
  import CheckboxSetting from "./CheckboxSetting.svelte";

  const dispatch = createEventDispatcher();

  const appSettings = getContext("appSettings");
  const labelSettings = getContext("generalLabelSettings");

  const fonts = [
    "Roboto Condensed",
    "Courier",
    "PT Sans Narrow",
    "Times New Roman",
    "Arial",
  ];
  //only include fonts here where we want to give the user an option to choose
  const fontWeights = {
    "Roboto Condensed": [100, 200, 300, 400],
  };

  if (hasArialNarrow()) {
    fonts.push("Arial Narrow");
  }

  $: if (!($labelSettings.font in fontWeights)) $labelSettings.fontWeight = 400;
</script>

<div class="w-full flex flex-col">
  <div
    class="w-full mt-[2em] [column-count:2] [column-width:50%] gap-[1em] mb-[1em]"
  >
    <CheckboxSetting
      bind:value={$labelSettings.showCollectionName}
      labelText={$t("addCollName", "Add my collection name")}
    />
    {#if $labelSettings.showCollectionName}
      <input
        type="text"
        bind:value={$labelSettings.collectionName}
        class="inline p-[10px] h-[10px]"
        placeholder={$t("collName", "Collection name")}
      /><br />
      <br />
    {/if}
    <CheckboxSetting
      bind:value={$labelSettings.detLabel}
      labelText={$t("dets", "Include det labels")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.detLabelOnly}
      labelText={$t("detsOnly", "Make det labels only")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.includeStageSexOnMainLabel}
      labelText={$t("stageSexOnMain", "Include stage/sex on main label")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.includePunch}
      labelText={$t("punch", "Include punch mark")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.includeQRCode}
      labelText={$t("qrCode", "Include QR code")}
    />
    {#if $labelSettings.includeQRCode && $labelSettings.detLabel && !$labelSettings.detLabelOnly}
      <CheckboxSetting
        bind:value={$labelSettings.qrCodeOnDetLabels}
        labelText={$t("onDetLabels", "Add it on det labels")}
      />
    {/if}
    <CheckboxSetting
      bind:value={$labelSettings.showStorage}
      labelText={$t("storage", "Show storage info")}
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
      bind:value={$labelSettings.includeProject}
      labelText={$t("project", "Include project name")}
    />
    <CheckboxSetting
      bind:value={$labelSettings.useRomanNumeralMonths}
      labelText={$t("romanNums", "Use Roman numerals for months")}
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
      bind:value={$labelSettings.addPrintedDate}
      labelText={$t("printDate", "Include printer model and date")}
    />
    {#if $labelSettings.addPrintedDate}
      <input
        type="text"
        bind:value={$labelSettings.printerModel}
        class="inline m-0 h-[10px]"
        placeholder={$t("printer", "Printer make and model")}
      /><br />
      <br />
    {/if}
  </div>
  <div class="flex gap-[5px]">
    <div>
      <label for="fonts" class="inline whitespace-nowrap"
        >{$t("font", "Font")}</label
      >
      <select id="fonts" bind:value={$labelSettings.font}>
        {#each fonts as font}
          <option value={font}>{font}</option>
        {/each}
      </select>
    </div>
    {#if $labelSettings.font in fontWeights}
      <div>
        <label for="font-weight" class="inline whitespace-nowrap"
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
        min={numberInputSettings.fontSize.min}
        max={numberInputSettings.fontSize.max}
        step={numberInputSettings.fontSize.step || 1}
        bind:value={$labelSettings.fontSize}
      />
    </div>
    <div>
      <NumberInput
        id="line-height"
        labelString={$t("lineHeight", "Line height")}
        min={numberInputSettings.lineHeight.min}
        max={numberInputSettings.lineHeight.max}
        step={numberInputSettings.lineHeight.step || 1}
        bind:value={$labelSettings.lineHeight}
      />
    </div>
    <div>
      <NumberInput
        id="label-width"
        labelString={$t("labelWidth", "Label width")}
        min={numberInputSettings.labelWidth.min}
        max={numberInputSettings.labelWidth.max}
        step={numberInputSettings.labelWidth.step || 1}
        bind:value={$labelSettings.labelWidth}
        unit={$t("labelWidthUnit", "cm")}
      />
    </div>
    {#if $labelSettings.includeQRCode}
      <div>
        <NumberInput
          id="qrcode-size"
          labelString={$t("CodeSize", "Code size")}
          min={numberInputSettings.qrCodeDims.min}
          max={numberInputSettings.qrCodeDims.max}
          step={numberInputSettings.qrCodeDims.step || 1}
          bind:value={$labelSettings.qrCodeDims}
        />
      </div>
    {/if}
  </div>
  <p class="relative m-0 top-[-1em] text-[0.7em]">
    {$t("saveSettings", "Settings are saved when you preview/print")}
  </p>
  <br />
</div>
