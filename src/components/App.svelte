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
  import makeLabelData from "../lib/makeLabelData";

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

  // Detect and set browser language on first visit
  if (localStorage.getItem("appSettings") === null) {
    const browserLang = (navigator.language || "").toLowerCase();
    let detectedLang = "en";
    if (browserLang.startsWith("es")) {
      detectedLang = "spa";
    } else if (browserLang.startsWith("fr")) {
      detectedLang = "fra";
    } else if (browserLang.startsWith("pt")) {
      detectedLang = "por";
    }
    defaultAppSettings.lang = detectedLang;
    localStorage.setItem("appSettings", JSON.stringify(defaultAppSettings));
  }

  reconcileStoredSettings("generalLabelSettings", defaultGeneralLabelSettings);
  reconcileStoredSettings(
    "herbariumLabelSettings",
    defaultHerbariumLabelSettings,
  );
  reconcileStoredSettings("entoLabelSettings", defaultEntoLabelSettings);

  const appSettings = writable(defaultAppSettings);

  // Persist app settings reactively to localStorage
  $: {
    localStorage.setItem("appSettings", JSON.stringify($appSettings));
  }
  const generalLabelSettings = writable(defaultGeneralLabelSettings);
  const herbariumLabelSettings = writable(defaultHerbariumLabelSettings);
  const entoLabelSettings = writable(defaultEntoLabelSettings);

  $: locale.set($appSettings.lang);

  $: logoSrc =
    $appSettings.lang === "fra"
      ? "/logo_2_fr.png"
      : $appSettings.lang === "spa" || $appSettings.lang === "por"
        ? "/logo_2_spa_por.png"
        : "/logo_2.png";

  let rawData = writable([]);
  let fieldMappings = writable({});
  let labelData = writable([]);

  $: labelSettingsStore =
    $appSettings.labelType == "general"
      ? generalLabelSettings
      : $appSettings.labelType == "herbarium"
        ? herbariumLabelSettings
        : entoLabelSettings;

  $: abbreviateCountries =
    $appSettings.labelType == "general" || $appSettings.labelType == "insect";

  $: if ($rawData.length > 0 && $fieldMappings[$appSettings.labelType]) {
    $labelData = makeLabelData(
      $rawData,
      $fieldMappings[$appSettings.labelType],
      abbreviateCountries,
      $labelSettingsStore.useRomanNumeralMonths,
      $labelSettingsStore.excludeNoCatnums,
      $labelSettingsStore.showStorage,
      $labelSettingsStore.includeCollectorInSort,
      $appSettings.labelType,
    );
  }

  setContext("data", rawData);
  setContext("appSettings", appSettings);
  setContext("generalLabelSettings", generalLabelSettings);
  setContext("herbariumLabelSettings", herbariumLabelSettings);
  setContext("entoLabelSettings", entoLabelSettings);
  setContext("mappings", fieldMappings);
  setContext("labelData", labelData);
</script>

<div class="hidden lg:block p-1 print:block print:mt-0">
  <Router {routes} />
</div>

<div
  class="flex w-screen flex-col p-[2rem] text-[1.2rem] lg:hidden print:hidden"
>
  <div>
    <a class="logo flex items-center" href="/" use:link
      ><img src={logoSrc} class="w-[200px]" alt="" /></a
    >
  </div>
  <div class="w-[80%] mt-[50px]">
    {$t(
      "mobileMessage",
      "Designing specimen labels is definitely a job for a large screen! Send the site link to your desktop or laptop computer and let's get going there...",
    )}
  </div>
</div>
