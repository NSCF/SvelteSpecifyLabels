<script>
  import InfoIcon from "../misc/InfoIcon.svelte";

  export let value;
  export let labelText;
  export let settingInfo;
</script>

<label class="inline-block break-inside-avoid text-wrap">
  <input type="checkbox" bind:checked={value} />
  {labelText}
  {#if settingInfo}
    <InfoIcon {settingInfo} />
  {/if}
</label>
<br />
