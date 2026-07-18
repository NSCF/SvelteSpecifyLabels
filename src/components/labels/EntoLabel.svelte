<script>
  import CutMarks from "../misc/CutMarks.svelte";
  import { getContext, createEventDispatcher } from "svelte";
  import firstLetterLowerCase from "../../lib/firstLetterLowerCase";
  import getLabelDet from "../../lib/getLabelDet";
  import { datamatrix, code128 } from "@bwip-js/browser";

  export let labelRecord;

  const dispatch = createEventDispatcher();
  const labelSettings = getContext("entoLabelSettings");

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
      true,
    );

  // Svelte actions for barcode and QR code rendering
  function renderBarcodeMain(node, catalogNumber) {
    if (catalogNumber) {
      let canvas = document.createElement("canvas");
      try {
        code128(canvas, {
          text: catalogNumber,
          includetext: false,
          height: 6,
        });
        node.src = canvas.toDataURL("image/png");
      } catch (e) {
        console.error("code128 error", e);
      }
    }
  }

  function renderBarcodeCatalog(node, catalogNumber) {
    if (catalogNumber) {
      let canvas = document.createElement("canvas");
      try {
        code128(canvas, {
          text: catalogNumber,
          includetext: false,
          height: 7.5,
        });
        node.src = canvas.toDataURL("image/png");
      } catch (e) {
        console.error("code128 error", e);
      }
    }
  }

  function renderQRCode(node, catalogNumber) {
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

  const collectorNumberString = () => {
    let collectorNumberString = "";
    if (labelRecord && labelRecord.recordNumber) {
      if (typeof labelRecord.recordNumber == "number") {
        if (labelRecord.primaryCollectorLastName) {
          collectorNumberString +=
            labelRecord.primaryCollectorLastName +
            " " +
            labelRecord.recordNumber;
        } else {
          collectorNumberString += " coll. no. " + labelRecord.recordNumber;
        }
      } else {
        collectorNumberString = labelRecord.recordNumber;
      }
    }
    return collectorNumberString;
  };

  const labelRendered = () => {
    dispatch("label-rendered");
  };

  // Helper to estimate number of wrapped lines a text string will occupy
  function estimateLinesForText(text, charactersPerLine) {
    if (!text) return 0;
    // Strip HTML tags for length estimation
    const cleanText = text.replace(/<[^>]*>/g, "");
    const words = cleanText.split(/\s+/);
    let lines = 1;
    let currentLineLength = 0;

    for (let word of words) {
      if (
        currentLineLength + word.length + (currentLineLength > 0 ? 1 : 0) <=
        charactersPerLine
      ) {
        currentLineLength += word.length + (currentLineLength > 0 ? 1 : 0);
      } else {
        lines++;
        currentLineLength = word.length;
      }
    }
    return lines;
  }

  // Chunks label parts into physical label boxes without splitting individual parts
  function chunkParts(parts, isLocality = false) {
    if (!parts || parts.length === 0) return [];

    const labelWidth = $labelSettings.labelWidth || 1.5;
    const labelHeight = $labelSettings.labelHeight || 0.7;
    const fontSize = $labelSettings.fontSize || 4;
    const lineHeight = $labelSettings.lineHeight || 100;

    const widthPoints = labelWidth * 28.346;
    const heightPoints = labelHeight * 28.346;
    const lineSpacing = fontSize * (lineHeight / 100);

    const widthFirst =
      isLocality &&
      $labelSettings.labelSize === "22x15" &&
      $labelSettings.barcodeOnMain
        ? widthPoints - 3 - 0.4 * 28.346
        : widthPoints - 3;
    const widthRest = widthPoints - 3;

    const charWidthFactor = $labelSettings.font === "Courier" ? 0.6 : 0.4;
    const charWidthPoints = fontSize * charWidthFactor;

    const charsFirst = Math.max(10, Math.floor(widthFirst / charWidthPoints));
    const charsRest = Math.max(10, Math.floor(widthRest / charWidthPoints));

    const usableHeightPoints = heightPoints - 2;

    // Calculate max lines per label
    const baseMaxLines = Math.max(
      2,
      Math.floor(usableHeightPoints / lineSpacing),
    );

    let chunks = [];
    let currentChunk = [];
    let currentChunkLines = 0;

    for (let part of parts) {
      if (part === null || part === undefined) continue;
      const partStr = part.toString().trim();
      if (!partStr) continue;

      const isFirst = chunks.length === 0;
      const chars = isFirst ? charsFirst : charsRest;

      const partLines = estimateLinesForText(partStr, chars);
      const limit = baseMaxLines;

      if (currentChunk.length > 0 && currentChunkLines + partLines > limit) {
        chunks.push(currentChunk);
        currentChunk = [partStr];
        const nextChars = charsRest;
        currentChunkLines = estimateLinesForText(partStr, nextChars);
      } else {
        currentChunk.push(partStr);
        currentChunkLines += partLines;
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  // 1. Locality & Collection Event parts
  const getLocalityParts = (rec) => {
    let parts = [];
    if (rec.fullLocality) parts.push(rec.fullLocality);

    // Alt and Coords
    let coordsLine = "";
    if (rec.fullCoordsString) coordsLine += rec.fullCoordsString;
    if (rec.labelElevation) {
      coordsLine += (coordsLine ? " " : "") + rec.labelElevation;
    }
    if (coordsLine) parts.push(coordsLine);

    // Sampling Method
    if (rec.samplingProtocol) {
      const method = rec.samplingProtocol.trim();
      if (method) {
        parts.push(method.charAt(0).toUpperCase() + method.slice(1));
      }
    }

    // Date
    let dateLine = rec.collectionDate || "";
    if (dateLine) {
      parts.push(dateLine.replace(/\//g, "-"));
    }

    // Collectors
    if (rec.recordedBy && rec.recordedBy.length) {
      const collectorsStr = rec.recordedBy.join(" ").replace(/;$/, "");
      if (collectorsStr) parts.push(collectorsStr);
    }

    // Collector/Record number
    if (rec.recordNumber) {
      parts.push(collectorNumberString());
    }

    return parts;
  };

  // 2. Habitat & Notes parts (weather conditions, occurrence remarks, event notes, basically any notes)
  const getNotesParts = (rec) => {
    let parts = [];
    if (rec.habitat) parts.push(rec.habitat);

    if (rec.eventRemarks) {
      parts.push(rec.eventRemarks);
    }

    if (rec.occurrenceRemarks) parts.push(rec.occurrenceRemarks);

    if (rec.permitNumber) parts.push("Permit: " + rec.permitNumber);

    return parts;
  };

  // 3. Determination parts
  const getDetParts = (rec) => {
    let parts = [];
    if (rec.family) parts.push(rec.family.toUpperCase());
    if (labelDet) parts.push(labelDet);

    let detBy = "";
    if (rec.identifiedBy) {
      detBy += "det. " + rec.identifiedBy;
    }
    if (rec.dateIdentified) {
      detBy +=
        (detBy ? " " : "") +
        `<span class="whitespace-nowrap">${rec.dateIdentified}</span>`;
    }
    if (detBy) parts.push(detBy);

    if (rec.identificationRemarks) parts.push(rec.identificationRemarks);

    if (rec.typeStatus) {
      let typeStr = rec.typeStatus.toUpperCase();
      if (rec.typeNumber) {
        typeStr += " No: " + rec.typeNumber;
      }
      parts.push(typeStr);
    }

    return parts;
  };
</script>

<div
  class="inline-block break-inside-avoid text-black"
  style="--font: {$labelSettings.font};
  --font-weight: {$labelSettings.fontWeight};
  --font-size: {$labelSettings.fontSize + 'pt'};
  --line-height: {$labelSettings.lineHeight + '%'};
  --label-width: {$labelSettings.labelWidth + 'cm'};
  --label-height: {$labelSettings.labelHeight + 'cm'};
  font-family: var(--font, sans-serif);
  font-size: var(--font-size, 4pt);
  font-weight: var(--font-weight, 400);
  line-height: var(--line-height, 100%);
  "
  use:labelRendered
>
  <!-- 1. Locality & Collection Event label -->
  {#if !$labelSettings.detLabelOnly}
    {#each chunkParts(getLocalityParts(labelRecord), true) as chunk, index}
      {#if $labelSettings.labelSize === "22x15" && $labelSettings.barcodeOnMain && labelRecord.catalogNumber}
        <div
          class="box-border p-[1px_2px] overflow-hidden flex flex-row items-stretch text-left bg-white break-inside-avoid mb-[2px] print:!border-[#aaa]"
          style="width: var(--label-width, 2.2cm); height: var(--label-height, 1.5cm); border: 0.1mm dashed #bbb;"
        >
          <!-- Left Column: Barcode/QR block -->
          {#if index === 0}
            <div
              class="flex flex-col justify-center items-center select-none"
              style="width: 0.4cm; flex-shrink: 0;"
            >
              {#if $labelSettings.includeQRCode}
                <div
                  class="flex flex-row-reverse items-center justify-center gap-[4px] rotate-[-90deg]"
                >
                  <img
                    alt="QR code"
                    class="object-contain"
                    style="width: 0.32cm; height: 0.32cm; min-width: 0.32cm;"
                    use:renderQRCode={labelRecord.catalogNumber}
                  />
                  <div
                    class="font-mono leading-none text-center whitespace-nowrap mt-[1px]"
                  >
                    {labelRecord.catalogNumber}
                  </div>
                </div>
              {:else if $labelSettings.includeBarcode}
                <div
                  class="flex items-center justify-center w-full h-full border"
                >
                  <div
                    class="flex flex-col items-center justify-center select-none border"
                    style="transform: rotate(-90deg); transform-origin: center; width: 1.3cm; height: 0.35cm; flex-shrink: 0;"
                  >
                    <img
                      alt="barcode"
                      style="width: 1.3cm; height: 0.18cm;"
                      use:renderBarcodeMain={labelRecord.catalogNumber}
                    />
                    <div class="font-mono leading-none text-center mt-0">
                      {labelRecord.catalogNumber}
                    </div>
                  </div>
                </div>
              {:else}
                <div
                  class="font-mono text-[4pt] leading-none text-center rotate-[-90deg] whitespace-nowrap"
                >
                  {labelRecord.catalogNumber}
                </div>
              {/if}
            </div>
          {/if}
          <!-- Right Column: Locality text -->
          <div
            class="flex-1 flex flex-col justify-center items-start overflow-hidden"
          >
            {#each chunk as line}
              <div class="w-full break-words block">{@html line}</div>
            {/each}
          </div>
        </div>
        <CutMarks char={"-"} />
      {:else}
        <div
          class="box-border p-[1px_2px] overflow-hidden flex flex-col justify-center items-start text-left bg-white break-inside-avoid mb-[2px] print:!border-[#aaa]"
          style="width: var(--label-width, 1.5cm); height: var(--label-height, 0.7cm); border: 0.1mm dashed #bbb;"
        >
          {#each chunk as line}
            <div class="w-full break-words block">{@html line}</div>
          {/each}
        </div>
        <CutMarks char={"-"} />
      {/if}
    {/each}

    <!-- 2. Notes label -->
    {#each chunkParts(getNotesParts(labelRecord), false) as chunk}
      <div
        class="box-border p-[1px_2px] overflow-hidden flex flex-col justify-center items-start text-left bg-white break-inside-avoid mb-[2px] print:!border-[#aaa]"
        style="width: var(--label-width, 1.5cm); height: var(--label-height, 0.7cm); border: 0.1mm dashed #bbb;"
      >
        {#each chunk as line}
          <div class="w-full break-words block">{@html line}</div>
        {/each}
      </div>
      <CutMarks char={"-"} />
    {/each}
  {/if}

  <!-- 3. Determination label -->
  {#if ($labelSettings.detLabel || $labelSettings.detLabelOnly) && labelDet}
    {@const detLines = getDetParts(labelRecord)}
    {#if detLines.length > 0}
      <div
        class="box-border p-[1px_2px] overflow-hidden flex flex-col justify-center items-start text-left bg-white break-inside-avoid mb-[2px] print:!border-[#aaa]"
        style="width: var(--label-width, 1.5cm); height: var(--label-height, 0.7cm); border: 0.1mm dashed #bbb;"
      >
        {#each detLines as line}
          <div class="w-full break-words block">{@html line}</div>
        {/each}
      </div>
      <CutMarks char={"-"} />
    {/if}
  {/if}

  <!-- 4. Catalog number label -->
  {#if !$labelSettings.detLabelOnly && labelRecord.catalogNumber && !($labelSettings.labelSize === "22x15" && $labelSettings.barcodeOnMain)}
    <div
      class="box-border p-[1px_2px] overflow-hidden flex flex-col justify-center items-center text-center bg-white break-inside-avoid mb-[2px] print:!border-[#aaa]"
      style="width: var(--label-width, 1.5cm); height: var(--label-height, 0.7cm); border: 0.1mm dashed #bbb;"
    >
      {#if $labelSettings.includeQRCode}
        <img
          alt="QR code"
          class="max-w-full max-h-[50%] object-contain"
          use:renderQRCode={labelRecord.catalogNumber}
        />
        <div
          class="w-full text-center font-mono leading-none mt-[1px] text-[120%]"
        >
          {labelRecord.catalogNumber}
        </div>
      {:else if $labelSettings.includeBarcode}
        <img
          alt="barcode"
          class="max-w-full max-h-[70%] object-contain"
          use:renderBarcodeCatalog={labelRecord.catalogNumber}
        />
        <div
          class="w-full text-center font-mono leading-none mt-[1px] text-[120%]"
        >
          {labelRecord.catalogNumber}
        </div>
      {:else}
        <div
          class="w-full text-center font-mono font-bold text-[120%] leading-none"
        >
          {labelRecord.catalogNumber}
        </div>
      {/if}
    </div>
    <CutMarks char={"-"} />
  {/if}
</div>
