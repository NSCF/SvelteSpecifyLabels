<script>
  import { getContext } from "svelte";
  import { link } from "svelte-spa-router";
  import { t } from "../../i18n/lang";

  const appSettings = getContext("appSettings");

  $: logoSrc =
    $appSettings.lang === "fra"
      ? "/logo_2_fr.png"
      : $appSettings.lang === "spa" || $appSettings.lang === "por"
        ? "/logo_2_spa_por.png"
        : "/logo_2.png";
</script>

<div
  class="relative flex w-full justify-between border-b border-b-[rgb(168,168,168)]"
>
  <div>
    <a
      class="logo font-normal hover:filter-none hover:no-underline flex items-center"
      href="/"
      use:link><img src={logoSrc} class="w-[200px]" alt="" /></a
    >
  </div>
  <nav class="flex gap-[2em] mr-[2em] items-center m-0">
    <a href="/" use:link>{$t("home", "Home")}</a>
    <a href="/info" use:link>{$t("info", "How to make labels")}</a>
    <a href="https://nscf.org.za/learn-more-about-us" target="_blank"
      >{$t("aboutNSCF", "About the NSCF")}</a
    >
    <select
      class="mt-2 bg-white border border-[#ccc] rounded-[4px] py-[0.25rem] px-[0.5rem] text-[0.9rem] text-[#333] cursor-pointer outline-none transition-[border-color,box-shadow] duration-200 hover:border-[#888] focus:border-[#555] focus:shadow-[0_0_0_2px_rgba(0,0,0,0.05)]"
      bind:value={$appSettings.lang}
    >
      <option value="en">English</option>
      <option value="spa">Español</option>
      <option value="fra">Français</option>
      <option value="por">Português</option>
    </select>
  </nav>
  <img
    class="absolute right-[-1.5em] top-[.5em] h-[1.5em] border-solid border-white rounded-[50%] rotate-[45deg]"
    src="github-cat.svg"
    alt="github"
  />
  <a
    title="view on github"
    class="absolute right-[-9em] w-[250px] h-[2em] rotate-[45deg] bg-[linear-gradient(transparent,transparent,transparent,transparent,transparent,lightgray,dimgray,gray)] text-[0.8rem]"
    href="https://github.com/NSCF/SvelteSpecifyLabels"
    target="_blank"
  >
  </a>
</div>
