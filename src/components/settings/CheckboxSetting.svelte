<script>
  import InfoIcon from "../misc/InfoIcon.svelte";

  export let value;
  export let labelText;
  export let settingInfo;
</script>

<label style="display:inline;">
  <input type="checkbox" bind:checked={value} />
  {labelText}
  {#if settingInfo}
    <InfoIcon {settingInfo} />
  {/if}
</label>
<br />
