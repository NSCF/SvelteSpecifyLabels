<script>
  import CutMarks from "../misc/CutMarks.svelte";
  import { getContext, createEventDispatcher } from "svelte";
  import firstLetterLowerCase from "../../lib/firstLetterLowerCase";
  import getLabelDet from "../../lib/getLabelDet";

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
    );

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

  // Smart splitting chunker function
  function splitLabelContent(parts, maxChars = 90) {
    let chunks = [];
    let currentChunk = [];
    let currentLength = 0;

    for (let part of parts) {
      if (part === null || part === undefined) continue;
      const partStr = part.toString().trim();
      if (!partStr) continue;

      // If adding this part exceeds maxChars or we have 5 lines, start a new chunk
      if ((currentLength + partStr.length > maxChars && currentChunk.length > 0) || currentChunk.length >= 5) {
        chunks.push(currentChunk);
        currentChunk = [partStr];
        currentLength = partStr.length;
      } else {
        currentChunk.push(partStr);
        currentLength += partStr.length;
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
    if (rec.geography) parts.push(rec.geography);
    if (rec.fullLocality) parts.push(rec.fullLocality);

    // Alt and Coords
    let coordsLine = "";
    if (rec.fullCoordsString) coordsLine += rec.fullCoordsString;
    if (rec.labelElevation) {
      coordsLine += (coordsLine ? " " : "") + rec.labelElevation;
    }
    if (coordsLine) parts.push(coordsLine);

    // Date
    let dateLine = rec.collectionDate || "";
    if (dateLine) parts.push(dateLine);

    // Collectors
    if (rec.recordedBy && rec.recordedBy.length) {
      const collectorsStr = rec.recordedBy.join(" ").replace(/;$/, "");
      if (collectorsStr) parts.push(collectorsStr);
    }

    // Catalog/Collector number if not showing det label or detLabelOnly
    if (!$labelSettings.detLabel || !$labelSettings.detLabelOnly) {
      if (rec.catalogNumber) {
        parts.push(rec.catalogNumber);
      } else if (rec.recordNumber) {
        parts.push(collectorNumberString());
      }
    }

    return parts;
  };

  // 2. Habitat & Notes parts
  const getHabitatParts = (rec) => {
    let parts = [];
    if (rec.habitat) parts.push(rec.habitat);

    let remarks = "";
    if (rec.samplingProtocol) {
      remarks += rec.samplingProtocol;
    }
    if (rec.eventRemarks) {
      remarks += (remarks ? " (" : "") + firstLetterLowerCase(rec.eventRemarks) + (remarks ? ")" : "");
    }
    if (remarks) parts.push(remarks);

    if (rec.occurrenceRemarks) parts.push(rec.occurrenceRemarks);

    if (rec.permitNumber) parts.push("Permit: " + rec.permitNumber);
    if (rec.project && $labelSettings.includeProjectLabel) parts.push(rec.project);

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
      detBy += (detBy ? " " : "") + rec.dateIdentified;
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

    // Always put catalog number on determination label if it exists
    if (rec.catalogNumber) {
      parts.push(rec.catalogNumber);
    }

    return parts;
  };
</script>

<div
  class="ento-label-container"
  style="--font: {$labelSettings.font};
  --font-weight: {$labelSettings.fontWeight};
  --font-size: {$labelSettings.fontSize + 'pt'};
  --line-height: {$labelSettings.lineHeight + '%'};
  --label-width: {$labelSettings.labelWidth + 'cm'};
  --label-height: {$labelSettings.labelHeight + 'cm'};
  "
  use:labelRendered
>
  <!-- 1. Locality & Collection Event labels -->
  {#if !$labelSettings.detLabelOnly}
    {#each splitLabelContent(getLocalityParts(labelRecord)) as chunk}
      <div class="ento-sub-label">
        {#if $labelSettings.showCollectionName && $labelSettings.collectionName}
          <div class="label-header">{$labelSettings.collectionName}</div>
        {/if}
        {#each chunk as line}
          <div class="label-line">{@html line}</div>
        {/each}
      </div>
      <CutMarks char={"-"} />
    {/each}

    <!-- 2. Habitat & Notes labels -->
    {#each splitLabelContent(getHabitatParts(labelRecord)) as chunk}
      <div class="ento-sub-label">
        {#each chunk as line}
          <div class="label-line">{@html line}</div>
        {/each}
      </div>
      <CutMarks char={"-"} />
    {/each}
  {/if}

  <!-- 3. Determination labels -->
  {#if ($labelSettings.detLabel || $labelSettings.detLabelOnly) && labelDet}
    {#each splitLabelContent(getDetParts(labelRecord)) as chunk}
      <div class="ento-sub-label">
        {#if $labelSettings.showCollectionName && $labelSettings.collectionName && $labelSettings.detLabelOnly}
          <div class="label-header">{$labelSettings.collectionName}</div>
        {/if}
        {#each chunk as line}
          <div class="label-line">{@html line}</div>
        {/each}
      </div>
      <CutMarks char={"-"} />
    {/each}
  {/if}
</div>

<style>
  .ento-label-container {
    display: inline-block;
    break-inside: avoid;
    font-family: var(--font, sans-serif);
    font-size: var(--font-size, 4pt);
    font-weight: var(--font-weight, 400);
    line-height: var(--line-height, 100%);
    color: black;
  }

  .ento-sub-label {
    width: var(--label-width, 1.5cm);
    height: var(--label-height, 0.7cm);
    box-sizing: border-box;
    border: 0.1mm dashed #bbb;
    padding: 1px 2px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    text-align: left;
    background-color: white;
    break-inside: avoid;
    margin-bottom: 2px;
  }

  .label-header {
    width: 100%;
    font-weight: bold;
    text-align: center;
    border-bottom: 0.05mm solid #ccc;
    margin-bottom: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .label-line {
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    display: block;
  }

  @media print {
    .ento-sub-label {
      border: 0.1mm dashed #aaa;
    }
  }
</style>
