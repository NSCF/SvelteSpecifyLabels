<script>
  import { getContext } from 'svelte';
  const { close } = getContext('simple-modal');
  
  export let message
</script>

<p>
  {message}
</p>
<button on:click={close} style="width:110px;float:right;">Okay</button>
<div style="clear: both;"/>

<style>

p {
  color:#a94442;
  font-weight: bold;
  font-size: 2em;
}

</style>