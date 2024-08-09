<script>
  import { getContext } from 'svelte'
  import { pop } from 'svelte-spa-router'
  import langs from "../i18n/lang";

  const settings = getContext('settings')

</script>

<button id="back-button" on:click={_ => pop()}>{langs['back'][$settings.lang]}</button>

<style>

  #back-button {
    background-color: LightGray; 
    color: dimgray; 
    border:none;
  }

  #back-button:hover {
    background-color: silver; 
  }
</style>