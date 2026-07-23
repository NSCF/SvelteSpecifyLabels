<script>
  import CutMarks from "../misc/CutMarks.svelte";
  import { getContext, createEventDispatcher } from "svelte";
  import firstLetterLowerCase from "../../lib/firstLetterLowerCase";
  import getLabelDet from "../../lib/getLabelDet";
  import { datamatrix } from "@bwip-js/browser";

  export let labelRecord;

  const dispatch = createEventDispatcher();
  const labelSettings = getContext("generalLabelSettings");

  let labelDet = null;

  $: if (
    labelRecord ||
    $labelSettings.includeTaxonAuthorities ||
    $labelSettings.italics
  )
    labelDet = getLabelDet(
      labelRecord,
      $labelSettings.includeTaxonAuthorities,
      false,
      $labelSettings.italics,
    );

  function renderDataMatrix(node, catalogNumber) {
    const draw = () => {
      if (catalogNumber) {
        let canvas = document.createElement("canvas");
        try {
          datamatrix(canvas, {
            text: catalogNumber,
            includetext: false,
          });
          node.src = canvas.toDataURL("image/png");
        } catch (e) {
          console.error("datamatrix error", e);
        }
      }
    };
    draw();
    return {
      update() {
        draw();
      },
    };
  }

  const getPrintDateString = (_) => {
    const now = new Date();
    const month = now.toLocaleString("default", { month: "short" });
    const year = now.getFullYear();
    return `${month}, ${year}`;
  };

  const collectorNumberString = (record) => {
    let collectorNumberString = "";
    if (record && record.recordNumber) {
      if (typeof record.recordNumber == "number") {
        if (record.primaryCollectorLastName) {
          collectorNumberString +=
            record.primaryCollectorLastName +
            " " +
            record.recordNumber;
        } else {
          collectorNumberString += " coll. no. " + record.recordNumber;
        }
      } else {
        collectorNumberString = record.recordNumber;
      }
    }

    return collectorNumberString;
  };

  const labelRendered = (_) => {
    dispatch("label-rendered");
  };

  $: boldWeight = Math.min(900, Number($labelSettings.fontWeight || 400) + 300);
  $: boldClass = $labelSettings.underline ? "underline" : "";
  $: boldStyle = $labelSettings.underline ? "" : `font-weight: ${boldWeight};`;
</script>

<div
  class="relative break-inside-avoid"
  style="--font: {$labelSettings.font};
  --font-weight: {$labelSettings.fontWeight};
  --font-size: {$labelSettings.fontSize + 'pt'};
  --line-height: {$labelSettings.lineHeight + '%'};
  --label-width: {$labelSettings.labelWidth + 'cm'};
  font-family: var(--font, sans-serif);
  font-size: calc(var(--font-size, 10pt));
  font-weight: var(--font-weight, 400);
  line-height: var(--line-height, 105%);
  "
  use:labelRendered
>
  <!-- storage location indicator at the top -->
  {#if $labelSettings.showStorage}
    {#if labelRecord.storageBox}
      <div class="p-[4px]">
        Box: {labelRecord.storageBox} -- cut this off label
      </div>
    {:else}
      <div class="p-[4px]">No storage recorded -- cut this off label</div>
    {/if}
    <CutMarks char={"—"} />
  {/if}
  <!-- MAIN LABEL -->
  {#if !$labelSettings.detLabelOnly}
    {#if $labelSettings.showCollectionName}
      <div
        class="w-full text-center mb-[.5em] {boldClass}"
        style={boldStyle}
      >
        {$labelSettings.collectionName || ""}
      </div>
    {/if}
    <div class="flex flex-row items-center pt-[3px] pb-[3px] min-h-0">
      {#if $labelSettings.includePunch}
        <div class="w-[10%] text-right">
          <svg height="10" width="10" class="inline">
            <circle cx="5" cy="5" r="2" fill="black" />
          </svg>
        </div>
      {/if}
      <div class="w-full">
        {#if labelRecord.catalogNumber || labelRecord.recordNumber || labelRecord.fieldNumber}
          <div class="flex flex-row-reverse justify-between mr-[1em]">
            {#if labelRecord.recordNumber || labelRecord.fieldNumber}
              <div
                class={!labelRecord.catalogNumber ? boldClass : ""}
                style={!labelRecord.catalogNumber ? boldStyle : ""}
              >
                {#if $labelSettings.includeFieldNumber && labelRecord.fieldNumber}
                  <span
                    >{labelRecord.fieldNumber}{labelRecord.recordNumber
                      ? " / " + labelRecord.recordNumber
                      : ""}</span
                  >
                {:else}
                  <span>{collectorNumberString(labelRecord)}</span>
                {/if}
              </div>
            {/if}
            {#if labelRecord.catalogNumber}
              <div class={boldClass} style={boldStyle}>
                {labelRecord.catalogNumber}
              </div>
            {/if}
          </div>
        {/if}
        <div class="m-0 clear-both">
          {#if labelRecord.fullLocality}
            {labelRecord.fullLocality}
          {/if}
          {#if labelRecord.labelElevation}
            <span class="inline-block m-0">{labelRecord.labelElevation}</span>
          {/if}
        </div>
        {#if labelRecord.fullCoordsString}
          <div class="inline-block m-0">{labelRecord.fullCoordsString}</div>
        {/if}
        <div class="m-0">
          {labelRecord.habitat || ""}
        </div>
        <div class="m-0">
          {#if labelRecord.collectionDate}
            <span class="mr-[0.1em]">{labelRecord.collectionDate}</span>
          {/if}
          {#if labelRecord.recordedBy && labelRecord.recordedBy.length}
            {#each labelRecord.recordedBy as coll}
              <span class="inline-block m-0 mr-[0.1em]">{coll}</span>
            {/each}
          {/if}
          {#if labelRecord.permitNumber}
            <span class="inline-block m-0 mr-[0.1em]"
              >Permit:&nbsp;{labelRecord.permitNumber}</span
            >
          {/if}
          {#if labelRecord.samplingProtocol && !labelRecord.eventRemarks}
            <span class="inline-block m-0">{labelRecord.samplingProtocol}</span>
          {/if}
        </div>
        <div class="m-0">
          {#if labelRecord.samplingProtocol && labelRecord.eventRemarks}
            <span class="inline-block m-0"
              >{labelRecord.samplingProtocol} ({firstLetterLowerCase(
                labelRecord.eventRemarks,
              )})</span
            >
          {:else}
            {labelRecord.eventRemarks || ""}
          {/if}
        </div>
        {#if labelRecord.specimenCount && $labelSettings.includeStageSexOnMainLabel}
          {#if labelRecord.specimenStageSex && labelRecord.specimenStageSex
              .match(/(\d+)/g)
              .reduce((x, y) => x + Number(y), 0) == Number(labelRecord.specimenCount)}
            <span class="inline-block m-0">{labelRecord.specimenStageSex}</span>
          {:else}
            <div>
              {#if labelRecord.specimenStageSex}
                <span class="inline-block m-0"
                  >({labelRecord.specimenStageSex})</span
                >
              {/if}
            </div>
          {/if}
        {/if}
        <div>
          {labelRecord.occurrenceRemarks || ""}
        </div>
        {#if labelRecord.typeStatus}
          <div class="after:content-[''] after:table after:clear-both">
            <span class="float-left uppercase">{labelRecord.typeStatus}</span>
            {#if labelRecord.typeNumber}
              <span class="float-right">Type No:{labelRecord.typeNumber}</span>
            {/if}
          </div>
        {/if}
        {#if $labelSettings.addPrintedDate}
          <div class={boldClass} style={boldStyle}>
            Printed on {$labelSettings.printerModel
              ? $labelSettings.printerModel
              : ""}
            {getPrintDateString()}
          </div>
        {/if}
        {#if labelRecord.project && $labelSettings.includeProject}
          <div class={boldClass} style={boldStyle}>
            {labelRecord.project}
          </div>
        {/if}
      </div>
      {#if labelRecord.catalogNumber && $labelSettings.includeQRCode && !($labelSettings.detLabelOnly || $labelSettings.qrCodeOnDetLabels)}
        <div class="m-[.25em]">
          <img
            width={$labelSettings.qrCodeDims}
            height={$labelSettings.qrCodeDims}
            use:renderDataMatrix={labelRecord.catalogNumber}
            alt="Data Matrix"
          />
        </div>
      {/if}
    </div>
  {/if}
  <!-- series / sample counts -->
  {#if labelRecord.seriesSampleCounts && Array.isArray(labelRecord.seriesSampleCounts) && labelRecord.seriesSampleCounts.length > 1}
    <!--this is customized for label data from Arthrobase-->
    <CutMarks char={"—"} />
    <div class="flex flex-row items-center pt-[3px] pb-[3px] min-h-0">
      <div class="w-full">
        <div
          class="inline-block m-0 {boldClass}"
          style={boldStyle}
        >
          Collecting events:
        </div>
        {#if labelRecord.catalogNumber || labelRecord.recordNumber || labelRecord.fieldNumber}
          <div class="flex flex-row-reverse justify-between mr-[1em]">
            {#if labelRecord.recordNumber}
              <div
                class={!labelRecord.catalogNumber ? boldClass : ""}
                style={!labelRecord.catalogNumber ? boldStyle : ""}
              >
                {#if $labelSettings.includeFieldNumber && labelRecord.fieldNumber}
                  <span
                    >{labelRecord.fieldNumber}{labelRecord.recordNumber
                      ? " / " + labelRecord.recordNumber
                      : ""}</span
                  >
                {:else}
                  <span>{collectorNumberString(labelRecord)}</span>
                {/if}
              </div>
            {/if}
            {#if labelRecord.catalogNumber}
              <div class={boldClass} style={boldStyle}>
                {labelRecord.catalogNumber}
              </div>
            {/if}
          </div>
        {/if}
        {#each labelRecord.seriesSampleCounts as ssc}
          {#if ssc.collectingDate}
            <br />
            <div>{ssc.collectingDate}</div>
            {#if ssc.collectors}
              <div>{ssc.collectors}</div>
            {/if}
            {#if ssc.collectMethods}
              <div>{ssc.collectMethods}</div>
            {/if}
            {#if ssc.conditions}
              <div>{ssc.conditions}</div>
            {/if}
            {#if ssc.lifeStageSexCounts}
              <div>{ssc.lifeStageSexCounts}</div>
            {/if}
            <br />
          {/if}
        {/each}
      </div>
    </div>
  {/if}
  <!-- determination label -->
  {#if ($labelSettings.detLabel || $labelSettings.detLabelOnly) && labelDet}
    <!-- Apologies to readers for these, detLabel flags whether to add the label, labelDet is what goes on the label -->
    {#if !$labelSettings.detLabelOnly}
      <CutMarks char={"—"} />
    {/if}
    {#if $labelSettings.detLabelOnly && $labelSettings.showCollectionName}
      <div
        class="w-full text-center mb-[.5em] {boldClass}"
        style={boldStyle}
      >
        {$labelSettings.collectionName || ""}
      </div>
    {/if}
    <div class="flex flex-row items-center pt-[3px] pb-[3px] min-h-0">
      {#if $labelSettings.includePunch}
        <div class="w-[10%] text-right">
          <svg height="10" width="10" class="inline">
            <circle cx="5" cy="5" r="2" fill="black" />
          </svg>
        </div>
      {/if}
      <div class="w-full">
        <div class="flex justify-between mr-[1em]">
          <!-- type status -->
          {#if labelRecord.typeStatus}
            <div class="uppercase">{labelRecord.typeStatus}</div>
          {:else if labelRecord.catalogNumber || labelRecord.recordNumber}
            <div />
            <!-- a placeholder -->
          {/if}
          <!-- catalog and/or collector number -->
          {#if labelRecord.catalogNumber}
            <div class={boldClass} style={boldStyle}>
              {labelRecord.catalogNumber}
            </div>
          {:else if labelRecord.recordNumber || labelRecord.fieldNumber}
            <div class={boldClass} style={boldStyle}>
              {#if $labelSettings.includeFieldNumber && labelRecord.fieldNumber}
                <span
                  >{labelRecord.fieldNumber}{labelRecord.recordNumber
                    ? " / " + labelRecord.recordNumber
                    : ""}</span
                >
              {:else}
                <span>{collectorNumberString(labelRecord)}</span>
              {/if}
            </div>
          {/if}
        </div>
        <!-- family if provided and different to the actual det -->
        {#if labelRecord.family && labelRecord.family != labelDet}
          <div class="clear-both">
            <span class="inline-block m-0"
              >{labelRecord.family.toUpperCase()}</span
            >
          </div>
        {/if}
        <!-- taxon name with all the bells and whistles... -->
        <div class="clear-both">
          <span
            class="inline-block m-0 {boldClass}"
            style={boldStyle}
          >
            {@html labelDet}
          </span>
        </div>
        <!-- det by and date -->
        <div>
          {#if labelRecord.identifiedBy || labelRecord.dateIdentified}
            <span>det: </span>
            <span>{labelRecord.identifiedBy || ""}</span>
            <span class="inline-block m-0"
              >{labelRecord.dateIdentified || ""}</span
            >
          {/if}
        </div>
        <!-- specimen stage and sex -->
        <div>
          {labelRecord.specimenStageSex || ""}
        </div>
        <div>
          {labelRecord.identificationRemarks || ""}
        </div>
        {#if labelRecord.typeStatus && labelRecord.typeNumber}
          <div class="after:content-[''] after:table after:clear-both">
            <span class="float-right">Type No:{labelRecord.typeNumber}</span>
          </div>
        {/if}
      </div>
      {#if labelRecord.catalogNumber && $labelSettings.includeQRCode && ($labelSettings.detLabelOnly || $labelSettings.qrCodeOnDetLabels)}
        <div class="m-[.25em]">
          <img
            width={$labelSettings.qrCodeDims}
            height={$labelSettings.qrCodeDims}
            use:renderDataMatrix={labelRecord.catalogNumber}
            alt="Data Matrix"
          />
        </div>
      {/if}
    </div>
  {/if}
  <CutMarks char={"-"} />
</div>
