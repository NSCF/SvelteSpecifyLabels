<script>
  import { getContext } from "svelte";
  import { t } from "../../i18n/lang";
  import numberInputSettings from "../../settings/numberInputSettings";

  const appSettings = getContext("appSettings");
  const labelSettings = getContext("herbariumLabelSettings");

  const fonts = [
    "Roboto Condensed",
    "Courier",
    "PT Sans Narrow",
    "Times New Roman",
    "Arial",
  ];
</script>

<div class="w-full flex flex-col">
  <div
    class="w-full mt-[2em] [column-count:2] [column-width:50%] gap-[1em] mb-[1em]"
  >
    <div class="[break-inside:avoid]">
      <label class="inline whitespace-nowrap">
        <input type="checkbox" bind:checked={$labelSettings.showCollectionName} />
        {$t("addCollName", "Add my collection name")}
      </label>
      <br />
      {#if $labelSettings.showCollectionName}
        <input
          type="text"
          bind:value={$labelSettings.collectionName}
          class="inline p-[10px] h-[10px]"
          placeholder={$t("collName", "Collection name")}
        /><br />
        <input
          type="text"
          bind:value={$labelSettings.institutionName}
          class="inline p-[10px] h-[10px]"
          placeholder={$t("inst", "Institution")}
        /><br />
      {/if}
    </div>
    <label class="inline whitespace-nowrap">
      <input type="checkbox" bind:checked={$labelSettings.detLabel} />
      {$t("detsOnly", "Make det labels only")}
    </label>
    <br />
    <label class="inline whitespace-nowrap">
      <input type="checkbox" bind:checked={$labelSettings.includeBarcode} />
      {$t("barcode", "Include barcode")}
    </label>
    <br />
    <label class="inline whitespace-nowrap [break-after:never]">
      <input type="checkbox" bind:checked={$labelSettings.includeQRCode} />
      {$t("qrCode", "Include QR code")}
    </label>
    <br />
    <label class="inline whitespace-nowrap">
      <input
        type="checkbox"
        bind:checked={$labelSettings.useRomanNumeralMonths}
      />
      {$t("romanNums", "Use Roman numerals for months")}
    </label>
    <br/>
    <label class="inline whitespace-nowrap">
      <input type=checkbox bind:checked={$labelSettings.includeTaxonAuthorities}>
      {$t('authors', 'Include taxon authorities')}
    </label>
    <br/>
    <label class="inline whitespace-nowrap">
      <input type=checkbox bind:checked={$labelSettings.underline}> <!-- TODO we need this for herbarium label separately -->
      {$t('underline', 'Underline, not bold')}
    </label>
    <br/>
    <label class="inline whitespace-nowrap">
      <input type=checkbox bind:checked={$labelSettings.italics}> <!-- TODO we need this for herbarium label separately -->
      {$t('italics', 'Italics for scientific names')}
    </label>
    <br/>
  </div>
  <div class="flex gap-[5px]">
    <div>
      <label for="label-size" class="inline whitespace-nowrap">{$t('labelSize', 'Label size')}</label>
      <select id="label-size" bind:value={$labelSettings.labelSize} disabled={$labelSettings.detLabel}>
        <option value="standard">Standard</option>
        <option value="large">Extra height</option>
      </select>
    </div>
    <div>
      <label for="fonts" class="inline whitespace-nowrap">{$t('font', 'Font')}</label>
      <select id="fonts" bind:value={$labelSettings.font}>
        {#each fonts as font}
        <option value={font}>{font}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="font-size" class="inline whitespace-nowrap">{$t('font-size', 'Font size')}</label>
      <select id="font-size" bind:value={$labelSettings.fontSize}>
        <option value="8">8</option>
        <option value="10">10</option>
      </select>
    </div>
  </div>
  <p class="relative m-0 top-[-1em] text-[0.7em]">{$t('saveSettings', 'Settings are saved when you preview/print')}</p>
  <br/>
</div>