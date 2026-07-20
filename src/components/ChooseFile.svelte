<script>
  import chardet from "chardet";
  import { createEventDispatcher } from "svelte";
  import { link } from "svelte-spa-router";
  import CloseIcon from "./misc/CloseIcon.svelte";
  import { t } from "../i18n/lang";
  import readCSV from "../lib/readCSVInput";
  import readJSON from "../lib/readJSONInput";
  import readFileAsUint8Array from "../lib/readFileAsUint8Array";
  import HelpIcon from "./misc/HelpIcon.svelte";

  const dispatch = createEventDispatcher();

  const fileMIMETypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "text/json",
    "application/json",
  ];

  let hiddenInput;
  let dialog;
  let dialogMessage = "This is a default message";
  let hovering = false;

  function isHovering(evt) {
    evt.stopPropagation(); // Do not allow the dragover event to bubble.
    evt.preventDefault(); // Prevent default dragover event behavior.
    hovering = true;
  }

  function isNotHovering(evt) {
    evt.stopPropagation(); // Do not allow the dragover event to bubble.
    evt.preventDefault(); // Prevent default dragover event behavior.
    hovering = false;
  }

  function handleFileSelected() {
    let targetFile = hiddenInput.files[0];
    hovering = false;
    toEmitOrNotToEmit(targetFile);
    hiddenInput.value = null;
  }

  function handleDragDrop(evt) {
    evt.stopPropagation(); // Do not allow the drop event to bubble.
    evt.preventDefault(); // Prevent default drop event behavior.
    hovering = false;
    let targetFile = evt.dataTransfer.files[0];
    toEmitOrNotToEmit(targetFile);
  }

  async function readDataFromFile(file) {
    if (!file) return;

    let rawData;

    if (file.type.endsWith("json")) {
      try {
        rawData = await readJSON(file);
      } catch (err) {
        throw err;
      }
    } else {
      // we need this because of Excel. Thank you Microsoft...
      let uint8Array;
      try {
        uint8Array = await readFileAsUint8Array(file);
      } catch (err) {
        throw err;
      }

      const encoding = chardet.detect(uint8Array);

      try {
        rawData = await readCSV(file, encoding);
      } catch (err) {
        throw err;
      }
    }

    let title = file.name.replace(/\.[a-z]+$/i, "").trim();
    if (!title.toLowerCase().includes("label")) {
      title += " labels";
    }

    return {
      data: rawData,
      title,
    };
  }

  async function toEmitOrNotToEmit(file) {
    if (file && fileMIMETypes.includes(file.type)) {
      try {
        const dataAndTitle = await readDataFromFile(file);
        dispatch("data", dataAndTitle);
      } catch (err) {
        showDialogMessage("Oops! Something went wrong: " + err.message);
      }
    } else {
      showDialogMessage("Please select a valid CSV file");
    }
  }

  const showDialogMessage = (message) => {
    if (message) {
      dialogMessage = message;
    }
    dialog.showModal();
  };
</script>

<!-- based on https://codepen.io/MSEdgeDev/pen/KzzNaZ -->
<div id="wrapper" class="w-full mx-auto mt-8 font-['segoe',sans-serif]">
  <div
    id="fileDropBox"
    class="mx-auto w-[20em] text-center text-[gray] bg-[var(--color-bg)] rounded-[7px] cursor-pointer {hovering
      ? 'border-[10px] border-dashed border-[grey]'
      : 'border-[10px] border-dashed border-[lightgray]'}"
    role="button"
    tabindex="0"
    on:mouseenter={isHovering}
    on:mouseleave={isNotHovering}
    on:dragenter={isHovering}
    on:dragleave={isNotHovering}
    on:drop={handleDragDrop}
    on:click={(_) => hiddenInput.click()}
    on:keydown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        hiddenInput.click();
      }
    }}
    ondragover="return false"
  >
    <h3 class="underline mt-[2em]">{$t("load", "Load some data")}</h3>
    <p class="mb-[2em] mx-[2em] pointer-events-none">
      {$t(
        "box",
        "Drag and drop a CSV file with your label data here or click to select from your hard drive",
      )}
    </p>
  </div>
</div>
<input
  type="file"
  bind:this={hiddenInput}
  class="hidden"
  on:change={handleFileSelected}
/>
<div class="w-[20em] flex justify-end m-auto">
  <a href="/info" use:link class="text-gray-400 hover:text-gray-600">
    <HelpIcon />
  </a>
</div>
<dialog class="bg-[#FFCC66]" bind:this={dialog}>
  <div class="flex w-full justify-end">
    <button
      class="bg-transparent border-none p-0 m-0"
      on:click={(_) => dialog.close()}><CloseIcon /></button
    >
  </div>
  <div>
    {dialogMessage}
  </div>
</dialog>
