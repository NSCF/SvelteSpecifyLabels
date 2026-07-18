<script>
  import { push } from 'svelte-spa-router'
  import { t } from "../../i18n/lang";
</script>

<button id="back-button" on:click={_ => push('/design')}>{$t('design', 'Design')}</button>

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