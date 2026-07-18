<script>
  import { onMount, getContext } from "svelte";
  import Header from "../misc/Header.svelte";

  const appSettings = getContext('appSettings')

  const langComponents = {
    en: async _ => await import('../langs/En.svelte'),
    afr: async _ => await import('../langs/Afr.svelte'),
    zul: async _ => await import('../langs/Zul.svelte'),
    spa: async _ => await import('../langs/Spa.svelte'),
    fra: async _ => await import('../langs/Fra.svelte'),
    por: async _ => await import('../langs/Por.svelte'),
  }

  let Lang 

  const getLang = async _ => {
    const loader = langComponents[$appSettings.lang] || langComponents['en']
    const result = await loader()
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
