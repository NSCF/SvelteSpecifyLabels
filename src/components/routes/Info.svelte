<script>
  import { onMount, getContext } from "svelte";
  import Header from "../misc/Header.svelte";

  const appSettings = getContext('appSettings')

  const langComponents = {
    en: async _ => await import('../langs/En.svelte'),
    afr: async _ => await import('../langs/Afr.svelte'),
  }

  let Lang 

  const getLang = async _ => {
    const result = await langComponents[$appSettings.lang]()
    Lang = result.default
  }

  onMount(getLang)

  $: $appSettings.lang, getLang()

</script>

<Header />
<div style="max-width:1200px; margin:auto;">

  {#if Lang}
  <svelte:component this={Lang} />
  {/if}
  
</div>
