<script>
  import { getContext } from "svelte";
  import { link } from "svelte-spa-router";
  import { t } from "../../i18n/lang";

  const appSettings = getContext("appSettings");
</script>

<div
  style="position:relative;display:flex; width: 100%; justify-content:space-between; border-bottom: 1px solid rgb(168, 168, 168);"
>
  <div>
    <a class="logo" style="display: flex;align-items:center" href="/" use:link
      ><img src="/logo_2.png" width="200px" alt="" /></a
    >
  </div>
  <nav style="display: flex; gap:2em;margin-right:2em;align-items:center;">
    <a href="/info" use:link>{$t("info", "How to make labels")}</a>
    <a href="https://nscf.org.za/learn-more-about-us" target="_blank"
      >{$t("aboutNSCF", "About the NSCF")}</a
    >
    <a href="/" use:link>{$t("home", "Home")}</a>
    <select class="lang-select" bind:value={$appSettings.lang}>
      <option value="en">English</option>
      <option value="spa">Español</option>
      <option value="fra">Français</option>
      <option value="por">Português</option>
    </select>
  </nav>
  <img
    style="position:absolute;right:-.5em;top:-.5em;height:1.5em;border:10px solid white;border-radius:50%;transform:rotate(45deg);"
    src="github-cat.svg"
    alt="github"
  />
  <a
    title="view on github"
    class="gradient"
    style="position:absolute;right:-7em;width:250px;height:2em;transform:rotate(45deg);"
    href="https://github.com/NSCF/SvelteSpecifyLabels"
    target="_blank"
  >
  </a>
</div>

<style>
  .logo {
    font-weight: normal;
  }

  .logo:hover {
    filter: none;
    text-decoration: none;
  }

  nav {
    margin: 0;
  }

  .lang-select {
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
    color: #333;
    cursor: pointer;
    outline: none;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .lang-select:hover {
    border-color: #888;
  }

  .lang-select:focus {
    border-color: #555;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
  }

  .gradient {
    background-image: linear-gradient(
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      lightgray,
      black
    );
  }
</style>
