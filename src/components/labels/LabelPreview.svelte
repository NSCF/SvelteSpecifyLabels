<script>
  import { getContext } from "svelte";
  import Label from "./Label.svelte";

  import MagnifyPlusIcon from "../misc/MagnifyPlusIcon.svelte";
  import MagnifyMinusIcon from "../misc/MagnifyMinusIcon.svelte";
  import ArrowLeftIcon from "../misc/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "../misc/ArrowRightIcon.svelte";

  const appSettings = getContext("appSettings");
  const generalLabelSettings = getContext("generalLabelSettings");
  const herbariumLabelSettings = getContext("herbariumLabelSettings");
  const entoLabelSettings = getContext("entoLabelSettings");
  const labelData = getContext("labelData");

  let recordIndex = 0;

  let labelSettings;
  if ($appSettings.labelType == "general") {
    labelSettings = generalLabelSettings;
  } else if ($appSettings.labelType == "herbarium") {
    labelSettings = herbariumLabelSettings;
  } else if ($appSettings.labelType == "insect") {
    labelSettings = entoLabelSettings;
  }

  const nextRecord = (_) => {
    if (recordIndex < $labelData.length - 1) {
      recordIndex++;
    }
  };

  const previousRecord = (_) => {
    if (recordIndex > 0) {
      recordIndex--;
    }
  };
</script>

<div
  class="flex flex-col h-full w-full text-black"
  style="--zoom:{$appSettings.labelType != 'herbarium'
    ? $labelSettings.zoom
    : 1}"
>
  <div class="flex-auto min-h-0 flex flex-col justify-center">
    <div
      class="design-mode pointer-events-none {$appSettings.labelType != 'herbarium'
        ? 'outline-[1px_solid_whitesmoke]'
        : ''}"
      style="width:{Number($labelSettings.labelWidth) +
        0.1}cm; padding:.1cm;margin:auto; transform: scale(var(--zoom));"
    >
      <Label labelRecord={$labelData[recordIndex]} on:label-rendered />
    </div>
  </div>
  <div
    id="zoom-controls"
    class="w-full flex justify-center items-center gap-[1em] relative z-10"
  >
    <button
      class="text-[#5f6368] p-[4px] bg-transparent border-none disabled:text-[lightgrey] disabled:cursor-auto cursor-pointer"
      on:click={previousRecord}
      disabled={recordIndex == 0}
    >
      <ArrowLeftIcon /></button
    >
    <span>{recordIndex + 1}</span>
    <button
      class="text-[#5f6368] p-[4px] bg-transparent border-none disabled:text-[lightgrey] disabled:cursor-auto cursor-pointer"
      on:click={nextRecord}
      disabled={recordIndex == $labelData.length - 1}
    >
      <ArrowRightIcon /></button
    >
    {#if $appSettings.labelType != "herbarium"}
      <div class="absolute bottom-[5px] right-[5px] flex items-center">
        {#if $labelSettings.zoom > 1}
          <span class="text-xs">{$labelSettings.zoom} X</span>
        {/if}
        {#if $labelSettings.zoom >= 2.0}
          <button
            class="text-[#5f6368] p-[4px] bg-transparent border-none disabled:text-[lightgrey] disabled:cursor-auto cursor-pointer"
            on:click={(_) => ($labelSettings.zoom = 1.0)}
          >
            <MagnifyPlusIcon /></button
          >
        {:else}
          <button
            class="text-[#5f6368] p-[4px] bg-transparent border-none disabled:text-[lightgrey] disabled:cursor-auto cursor-pointer"
            on:click={(_) => ($labelSettings.zoom += 0.5)}
          >
            <MagnifyMinusIcon />
          </button>
        {/if}
      </div>
    {/if}
  </div>
</div>
