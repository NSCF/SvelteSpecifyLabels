<script>
  import { onMount, getContext } from "svelte";
  import { push, link } from "svelte-spa-router";
  import tippy from "tippy.js";
  import "tippy.js/dist/tippy.css"; // optional for styling
  import "../../tippy-themes.css";
  import Header from "../misc/Header.svelte";
  import ChooseFile from "../ChooseFile.svelte";
  import langs from "../../i18n/lang";

  let title = "NSCF Labels";

  const rawData = getContext("data");
  const appSettings = getContext("appSettings");

  $rawData = []; //in case we return to this page and want to add new data

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
      "Tiny labels for pinned insects, with fixed dimensions and small font, and the data separated onto individual parts. Include a 'labelLocality' field for abbreviated locality information while maintaining a full locality description in your primary dataset.",
  };

  // lets add those descriptions
  onMount(() => {
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
<div style="max-width:1200px; margin:auto">
  <div style="margin:auto;margin-top:50px;">
    <div
      style="display:flex;width:700px;justify-content:space-around;margin:auto;margin-top:20px; "
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
          >{langs["wet"][$appSettings.lang]}</label
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
          >{langs["herbarium"][$appSettings.lang]}</label
        ><br />
      </div>
      <div>
        <input
          type="radio"
          id="insectlabel"
          name="label-type"
          value="insect"
          bind:group={$appSettings.labelType}
          disabled
        />
        <label for="insectlabel" data-tippy-content={labelExplanations.insect}
          >{langs["insect"][$appSettings.lang]} ({langs["coming"][
            $appSettings.lang
          ]})</label
        >
      </div>
    </div>
    <ChooseFile on:data={handleFileDataAndTitle} />
    <div style="width:100%; display: flex; justify-content:flex-end; gap:2em;">
      <a
        href="/design"
        use:link
        on:click|preventDefault={(_) => push("/design")}
        >{langs["exampleLabels"][$appSettings.lang]}</a
      >
    </div>
  </div>
</div>
