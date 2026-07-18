<script>
  import { getContext } from "svelte";
  import Label from "./Label.svelte";

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
      class={$appSettings.labelType != "herbarium"
        ? "outline-[1px_solid_whitesmoke]"
        : ""}
      style="width:{Number($labelSettings.labelWidth) +
        0.1}cm; padding:.1cm;margin:auto; transform: scale(var(--zoom));"
    >
      <Label labelRecord={$labelData[recordIndex]} on:label-rendered />
    </div>
  </div>
  <div
    id="zoom-controls"
    class="w-full flex justify-center items-center gap-[1em]"
  >
    <button
      class="text-[#5f6368] p-[4px] bg-transparent border-none disabled:text-[lightgrey] disabled:cursor-auto cursor-pointer"
      on:click={previousRecord}
      disabled={recordIndex == 0}
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        class="inline"
        height="2em"
        viewBox="0 -960 960 960"
        ><path
          fill="currentColor"
          d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"
        /></svg
      ></button
    >
    <span>{recordIndex + 1}</span>
    <button
      class="text-[#5f6368] p-[4px] bg-transparent border-none disabled:text-[lightgrey] disabled:cursor-auto cursor-pointer"
      on:click={nextRecord}
      disabled={recordIndex == $labelData.length - 1}
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        class="inline"
        height="2em"
        viewBox="0 -960 960 960"
        ><path
          fill="currentColor"
          d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"
        /></svg
      ></button
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
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              class="inline"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
              ><path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400ZM280-540v-80h200v80H280Z"
              /></svg
            ></button
          >
        {:else}
          <button
            class="text-[#5f6368] p-[4px] bg-transparent border-none disabled:text-[lightgrey] disabled:cursor-auto cursor-pointer"
            on:click={(_) => ($labelSettings.zoom += 0.5)}
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              class="inline"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
              ><path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-60v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"
              /></svg
            ></button
          >
        {/if}
      </div>
    {/if}
  </div>
</div>
