<script>
  import { getContext, createEventDispatcher } from "svelte";
  import getLabelDet from "../../lib/getLabelDet";
  import QRCode from "qrcode";
  import JsBarcode from "jsbarcode";

  const dispatch = createEventDispatcher();

  export let labelRecord;

  const labelSettings = getContext("herbariumLabelSettings");

  let labelDet = null;
  let qrImg;
  let barcodeImg;

  $: if (
    labelRecord ||
    $labelSettings.includeTaxonAuthorities ||
    $labelSettings.italics
  )
    labelDet = getLabelDet(
      labelRecord,
      $labelSettings.includeTaxonAuthorities,
      true,
      $labelSettings.italics,
    );

  $: if (
    $labelSettings.includeQRCode &&
    $labelSettings.qrCodeErrorLevel &&
    qrImg &&
    labelRecord &&
    labelRecord.catalogNumber
  ) {
    QRCode.toDataURL(
      labelRecord.catalogNumber,
      { margin: 0, errorCorrectionLevel: $labelSettings.qrCodeErrorLevel },
      function (error, url) {
        if (error) console.error(error);
        if (url) qrImg.src = url;
      },
    );
  }

  $: if (
    $labelSettings.includeBarcode &&
    !$labelSettings.includeQRCode &&
    barcodeImg &&
    labelRecord &&
    labelRecord.catalogNumber
  ) {
    JsBarcode(barcodeImg, labelRecord.catalogNumber, {
      width: 1.2,
      height: 30,
      margin: 0,
      displayValue: false,
    });
  }

  const labelRendered = (_) => {
    dispatch("label-rendered");
  };
</script>

<div
  class="p-[.5em] break-inside-avoid"
  style="
  --font: {$labelSettings.font};
  --font-size: {$labelSettings.fontSize + 'pt'};
  font-family: var(--font, sans-serif);
  font-size: var(--font-size, 10pt);"
>
  {#if !$labelSettings.detLabel}
    <div
      class="flex flex-col items-center"
      style="--label-width: {$labelSettings.labelWidth};
      --label-height: {$labelSettings.labelSize == 'standard'
        ? '9.5cm'
        : '12cm'};
      width: var(--label-width, 9cm);
      height: var(--label-height, 9.5cm);"
      use:labelRendered
    >
      {#if $labelSettings.showCollectionName}
        <div class="w-full flex flex-col items-center">
          <div
            class="{$labelSettings.underline
              ? 'underline'
              : 'font-bold'} text-[1.2em]"
          >
            {$labelSettings.collectionName || ""}
          </div>
          {#if $labelSettings.institutionName}
            <div class={$labelSettings.underline ? "underline" : "font-bold"}>
              {$labelSettings.institutionName}
            </div>
          {/if}
        </div>
      {/if}
      <div
        class="w-full p-[0.2em] flex-auto min-h-0 border border-black flex flex-col justify-between leading-[100%]"
      >
        <div
          class="w-full flex flex-col h-[3em] justify-center border-b border-b-[gray]"
        >
          <div class="w-full">
            <div class="flex justify-between">
              <div
                class="uppercase one-line-condensed {$labelSettings.underline
                  ? 'underline'
                  : 'font-bold'}"
              >
                {labelRecord.family || "No family"}
              </div>
            </div>
            <div>{@html labelDet || ""}</div>
          </div>
        </div>
        <div class="pt-[5px] pb-[5px] flex-auto flex flex-col justify-between">
          <div class="flex w-full items-center">
            <div class="w-full">
              <div id="locality">{labelRecord.fullLocality || ""}</div>
              <div class="w-full flex justify-between">
                <div id="coords" class="">
                  {labelRecord.fullCoordsString || ""}
                  {labelRecord.gridReference
                    ? "[" + labelRecord.gridReference + "]"
                    : ""}
                </div>
                <div>
                  {labelRecord.labelElevation
                    ? "Alt: " + labelRecord.labelElevation
                    : ""}
                </div>
              </div>
            </div>
          </div>
          <div class="">{labelRecord.habitat || ""}</div>
          <div class="">{labelRecord.description || ""}</div>
          <div class="">{labelRecord.notes || ""}</div>
          <div class="">
            <div>
              Leg.: {labelRecord.recordedBy}{labelRecord.additionalCollectors
                ? ", with " + labelRecord.additionalCollectors
                : ""}
            </div>
            <div class="flex justify-between">
              {#if labelRecord.recordNumber}
                {#if typeof labelRecord.recordNumber == "number"}
                  {#if labelRecord.primaryCollectorLastName}
                    <div>
                      {labelRecord.primaryCollectorLastName}
                      {labelRecord.recordNumber}
                    </div>
                  {:else}
                    <div>No. {labelRecord.recordNumber}</div>
                  {/if}
                {:else}
                  <div>{labelRecord.recordNumber}</div>
                {/if}
              {:else}
                <div></div>
                <!-- placeholder for the flex -->
              {/if}
              <div>{labelRecord.collectionDate || ""}</div>
            </div>
          </div>
          <div class="flex justify-between">
            {#if labelRecord.identifiedBy}
              <div>Det: {labelRecord.identifiedBy}</div>
              <div>{labelRecord.dateIdentified || ""}</div>
            {:else}
              <div>Det:</div>
            {/if}
          </div>
        </div>
        <div class="w-full border-t border-t-black">
          <div class="w-full flex justify-between">
            {#if labelRecord.familyCode}
              <div class="w-[30%]">Family: {labelRecord.familyCode}</div>
            {/if}
            {#if labelRecord.genusCode}
              <div class="w-[30%] whitespace-nowrap">
                Genus: {labelRecord.genusCode}
              </div>
            {/if}
          </div>
          <div
            class="w-full flex justify-between items-center h-[35px] {$labelSettings.includeQRCode
              ? 'mt-[5px]'
              : 'mt-0'}"
          >
            <div>{labelRecord.catalogNumber || ""}</div>
            {#if $labelSettings.includeQRCode}
              <img class="h-full mr-[20px]" alt="QR code" bind:this={qrImg} />
            {:else if $labelSettings.includeBarcode}
              <svg
                alt="barcode"
                class="[image-rendering:crisp-edges]"
                bind:this={barcodeImg}
              />
            {/if}
          </div>
          <div>Project: {labelRecord.project || ""}</div>
          <div class="flex justify-between">
            <div>
              Dups: {labelRecord.duplicates || ""}
            </div>
            <div>
              {#if labelRecord.permitNumber}
                Permit: {labelRecord.permitNumber}
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div
      class="w-[8cm] m-auto p-[10px] border-[2px] border-solid border-[whitesmoke]"
    >
      <div class="flex justify-end">
        {#if labelRecord.catalogNumber}
          <div>{labelRecord.catalogNumber}</div>
        {:else if labelRecord.recordNumber}
          {#if isNaN(labelRecord.recordNumber)}
            <div>{labelRecord.recordNumber}</div>
          {:else if labelRecord.primaryCollectorLastName}
            <div>
              {labelRecord.primaryCollectorLastName}
              {labelRecord.recordNumber}
            </div>
          {:else}
            <div>
              Coll. no. {labelRecord.recordedBy
                ? labelRecord.recordedBy.split(/[,\s;]/)[0]
                : ""}
              {labelRecord.recordNumber}
            </div>
          {/if}
        {/if}
      </div>
      <div class={$labelSettings.underline ? "underline" : "font-bold"}>
        {@html labelDet || ""}
      </div>
      <div class="flex justify-between">
        <div>Det: {labelRecord.identifiedBy}</div>
        <div>{labelRecord.dateIdentified}</div>
      </div>
      {#if labelRecord.identificationRemarks}
        <div>
          {labelRecord.identificationRemarks}
        </div>
      {/if}
    </div>
  {/if}
</div>
