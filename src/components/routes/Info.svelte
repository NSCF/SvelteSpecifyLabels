<script>
  import { onMount, getContext } from "svelte";
  import Header from "../Header.svelte";

  const settings = getContext('settings')

  const langComponents = {
    en: 'En.svelte',
    afr: 'Afr.svelte'
  }

  let Lang 

  const getLang = async _ => {
    Lang = (await import('../langs/' + langComponents[$settings.lang])).default
  }

  onMount(getLang)

  $: $settings.lang, getLang()

</script>

<div style="max-width:1200px; margin:auto;">

  <Header />
  {#if Lang}
  <svelte:component this={Lang} />
  {/if}
  
</div>
