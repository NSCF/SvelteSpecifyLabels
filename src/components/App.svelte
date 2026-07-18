<script>
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import Router, { link } from "svelte-spa-router";
  import routes from "../lib/routes";
  import reconcileStoredSettings from "../lib/reconcileStoredSettings";

  import defaultAppSettings from "../settings/appSettings";
  import defaultGeneralLabelSettings from "../settings/generalLabelSettings";
  import defaultHerbariumLabelSettings from "../settings/herbariumLabelSettings";
  import defaultEntoLabelSettings from "../settings/entoLabelSettings";
  import { locale, t } from "../i18n/lang";

  // we need this for legacy purposes, because the structure of settings changed...
  if (localStorage.getItem("labelSettings") != null) {
    // so we can handle evolution of settings...
    const savedSettings = JSON.parse(localStorage.getItem("labelSettings"));
    for (const [key, val] of Object.entries(savedSettings)) {
      if (key in defaultAppSettings) {
        defaultAppSettings[key] = val;
      }
      if (key in defaultGeneralLabelSettings) {
        defaultGeneralLabelSettings[key] = val;
      }
      //but not herbariumLabelSettings, as we've changed those field names...
    }
    localStorage.removeItem("labelSettings");
    localStorage.setItem("appSettings", JSON.stringify(defaultAppSettings));
    localStorage.setItem(
      "generalLabelSettings",
      JSON.stringify(defaultGeneralLabelSettings),
    );
  }

  //now we do the same for the new settings
  reconcileStoredSettings("appSettings", defaultAppSettings);
  reconcileStoredSettings("generalLabelSettings", defaultGeneralLabelSettings);
  reconcileStoredSettings(
    "herbariumLabelSettings",
    defaultHerbariumLabelSettings,
  );
  reconcileStoredSettings("entoLabelSettings", defaultEntoLabelSettings);

  const appSettings = writable(defaultAppSettings);
  const generalLabelSettings = writable(defaultGeneralLabelSettings);
  const herbariumLabelSettings = writable(defaultHerbariumLabelSettings);
  const entoLabelSettings = writable(defaultEntoLabelSettings);

  $: locale.set($appSettings.lang);

  let rawData = writable([]);
  let fieldMappings = writable({});
  let labelData = writable([]);

  setContext("data", rawData);
  setContext("appSettings", appSettings);
  setContext("generalLabelSettings", generalLabelSettings);
  setContext("herbariumLabelSettings", herbariumLabelSettings);
  setContext("entoLabelSettings", entoLabelSettings);
  setContext("mappings", fieldMappings);
  setContext("labelData", labelData);
</script>

<div class="container">
  <Router {routes} />
</div>

<div class="mobile-message">
  <div>
    <a class="logo" style="display: flex;align-items:center" href="/" use:link
      ><img src="/logo_2.png" width="200px" alt="" /></a
    >
  </div>
  <div style="width:80%;margin-top:50px;">
    {$t(
      "mobileMessage",
      "Designing specimen labels is definitely a job for a large screen! Send the site link to your desktop or laptop computer and let's get going there...",
    )}
  </div>
</div>

<style>
  .container {
    display: none;
  }

  .mobile-message {
    display: flex;
    width: 100vw;
    flex-direction: column;
    padding: 2rem;
    font-size: 1.2rem;
  }

  /* Large screens (e.g. >= 1024px) */
  @media (min-width: 1024px) {
    .container {
      display: block;
      margin: 0 2em 2em;
      padding: 0px;
    }

    .mobile-message {
      display: none;
    }
  }

  @media print {
    .container {
      display: block;
      margin-top: 0;
    }

    .mobile-message {
      display: none;
    }
  }
</style>
