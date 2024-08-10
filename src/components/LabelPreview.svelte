<script>
  import { getContext } from "svelte";
  import Label from "./Label.svelte";
  const settings = getContext('settings')
  const labelData = getContext('labelData')

  let recordIndex = 0
  let labelWidth

  const nextRecord = _ => {
    if (recordIndex < $labelData.length - 1){
      recordIndex++
    }
  }

  const previousRecord = _ => {
    if (recordIndex > 0){
      recordIndex--
    }
  }

  //unfortunately we need this twice, here and in LabelLayout
  const getLabelWidth = _ => {
    if ($settings.type == 'general') {
      return $settings.labelWidth + 'cm'
    }
    else {
      return '9cm'
    }
  }

  $: $settings.type, labelWidth = getLabelWidth()

</script>

<div style="width:100%; height:100%; display:flex;flex-direction:column;align-items:center;color:black;--zoom:{$settings.type == 'general' ? $settings.generalLabelZoom : 1 }">
  <div  style="width: { labelWidth }; flex:1 1 0; min-height:0;display:flex;flex-direction:column;justify-content:center;">
    <div class="zoom" >
      <Label labelRecord={$labelData[recordIndex]} on:label-rendered />
    </div>
  </div>
  <div style="position:relative;width:100%;display:flex;justify-content:center;align-items:center;gap:1em">
    <button class="arrow-button" on:click={previousRecord} disabled={recordIndex == 0}><svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 -960 960 960" ><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg></button>
    <span>{recordIndex + 1}</span>
    <button class="arrow-button" on:click={nextRecord} disabled={recordIndex == $labelData.length - 1}><svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 -960 960 960"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg></button>
    {#if $settings.type != 'herbarium'}
    <div style="position:absolute;top:5px;right:5px;display:flex;align-items:center;">
      {#if $settings.generalLabelZoom > 1}
      <span style="margin-bottom: 10px;">X {$settings.generalLabelZoom}</span>
      {/if}
      {#if $settings.generalLabelZoom >= 2.0}
        <button class="arrow-button" on:click={_ => $settings.generalLabelZoom = 1.0}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400ZM280-540v-80h200v80H280Z"/></svg></button>
      {:else}
        <button class="arrow-button" on:click={_ => $settings.generalLabelZoom += .5 }><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-60v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg></button>
      {/if}
    </div>
    {/if}
  </div>
</div>

<style>

  .arrow-button {
    color: #5f6368;
    padding: 4px;
    background-color: transparent; 
    border: none; 
  } 

  svg path {
    fill: currentColor;
  }

  .arrow-button:disabled {
    color:lightgrey;
  }

  .arrow-button:hover:disabled {
    cursor: auto;
  }

  .zoom {
    transform: scale(var(--zoom));
  }

</style>