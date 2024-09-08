<script>
  import { getContext } from 'svelte'
  import { push } from 'svelte-spa-router'
  import langs from "../../i18n/lang";

  const appSettings = getContext('appSettings')

</script>

<button id="back-button" on:click={_ => push('/design')}>{langs['design'][$appSettings.lang]}</button>

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