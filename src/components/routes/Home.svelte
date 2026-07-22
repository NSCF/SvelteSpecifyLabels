<script>
  import { onMount, getContext } from "svelte";
  import { push, link } from "svelte-spa-router";
  import tippy from "tippy.js";
  import "tippy.js/dist/tippy.css"; // optional for styling
  import "../../tippy-themes.css";
  import Header from "../misc/Header.svelte";
  import ChooseFile from "../ChooseFile.svelte";
  import { t } from "../../i18n/lang";
  import { trackPageView } from "../../lib/analytics";

  let title = "NSCF Labels";

  const rawData = getContext("data");
  const appSettings = getContext("appSettings");

  $rawData = []; //in case we return to this page and want to add new data

  let initialTracked = false;
  $: if ($appSettings.labelType) {
    if (initialTracked) {
      trackPageView("/", $appSettings.labelType, $appSettings.lang);
    }
  }

  const handleFileDataAndTitle = async (ev) => {
    let payload = ev.detail;
    $rawData = payload.data;
    title = payload.title;
    push("/design");
  };

  const labelExplanations = {
    general:
      "Landscape orientation labels that expand to fit their content, typically used in wet collections, with bird and mammals skins, macrofungi, etc.",
    herbarium:
      "Standard herbarium specimen labels, portrait format, with fixed dimensions. Options available to add herbarium / institution name.",
    insect:
      "Tiny labels for pinned insects, with fixed dimensions and small font, and the data separated onto individual parts. Include a 'shortLocality' field for abbreviated locality information while maintaining a full locality description in your primary dataset.",
  };

  // lets add those descriptions
  onMount(() => {
    trackPageView("/", $appSettings.labelType, $appSettings.lang);
    initialTracked = true;
    tippy("[data-tippy-content]", {
      delay: [400, 200],
      theme: "light-translucent",
    });
  });
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<Header />
<div class="max-w-[1200px] mx-auto">
  <div class="mx-auto mt-[50px]">
    <div
      class="flex w-[700px] justify-around mx-auto mt-[20px]"
    >
      <div>
        <input
          type="radio"
          id="wetlabel"
          name="label-type"
          value="general"
          bind:group={$appSettings.labelType}
        />
        <label for="wetlabel" data-tippy-content={labelExplanations.general}
          >{$t("wet", "General/wet labels")}</label
        ><br />
      </div>
      <div>
        <input
          type="radio"
          id="herbariumlabel"
          name="label-type"
          value="herbarium"
          bind:group={$appSettings.labelType}
        />
        <label
          for="herbariumlabel"
          data-tippy-content={labelExplanations.herbarium}
          >{$t("herbarium", "Herbarium labels")}</label
        ><br />
      </div>
      <div>
        <input
          type="radio"
          id="insectlabel"
          name="label-type"
          value="insect"
          bind:group={$appSettings.labelType}
        />
        <label for="insectlabel" data-tippy-content={labelExplanations.insect}
          >{$t("insect", "Ento labels")}</label
        >
      </div>
    </div>
    <ChooseFile on:data={handleFileDataAndTitle} />
    <div class="w-full flex justify-end gap-[2em]">
      <a
        href="/design"
        use:link
        on:click|preventDefault={(_) => push("/design")}
        >{$t("exampleLabels", "Example labels")}</a
      >
    </div>
  </div>
</div>
