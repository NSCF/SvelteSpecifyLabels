<script>
  import chardet from 'chardet';
  import {getContext, createEventDispatcher } from 'svelte';
  import CloseIcon from './CloseIcon.svelte';
  import langs from '../i18n/lang';
	import readCSV from '../lib/readCSVInput'
	import readJSON from '../lib/readJSONInput'
  import readFileAsUint8Array from '../lib/readFileAsUint8Array'

  const dispatch = createEventDispatcher();
  const settings = getContext('settings')

  const fileMIMETypes = ['text/csv', 'application/vnd.ms-excel', 'text/json', 'application/json']

  let hiddenInput
  let dialog
  let dialogMessage = "This is a default message"
  let hovering = false

  function isHovering(evt) {
    evt.stopPropagation(); // Do not allow the dragover event to bubble.
    evt.preventDefault(); // Prevent default dragover event behavior.
    hovering = true
  }

  function isNotHovering(evt) {
    evt.stopPropagation(); // Do not allow the dragover event to bubble.
    evt.preventDefault(); // Prevent default dragover event behavior.
    hovering = false
  }

  function handleFileSelected() {
    let targetFile = hiddenInput.files[0];
    hovering = false
    toEmitOrNotToEmit(targetFile)
    hiddenInput.value = null
  }

  function handleDragDrop(evt){
    evt.stopPropagation(); // Do not allow the drop event to bubble.
    evt.preventDefault(); // Prevent default drop event behavior.
    hovering = false
    let targetFile = evt.dataTransfer.files[0];
    toEmitOrNotToEmit(targetFile)
  }

  async function readDataFromFile(file) {

    if (!file) return
		
    let rawData
    
    if(file.type.endsWith('json')){
			try {
				rawData = await readJSON(file)
			}
			catch(err) {
				throw(err)
			}
		}
		else {

      // we need this because of Excel. Thank you Microsoft...
      let uint8Array
      try {
        uint8Array = await readFileAsUint8Array(file)
      }
      catch(err){
        throw(err)
      }
      
      const encoding = chardet.detect(uint8Array);
    
      try {
        rawData = await readCSV(file, encoding)
      }
      catch(err) {
        throw(err)
      }
			
		}

    let title = file.name.replace(/\.[a-z]+$/i, '').trim()
		if (!title.toLowerCase().includes('label')) {
			title += ' labels'
		}

    return {
      data: rawData,
      title
    }
  }

  async function toEmitOrNotToEmit(file){
    if(file && (fileMIMETypes.includes(file.type))){
      try {
        const dataAndTitle = await readDataFromFile(file)
        dispatch('data', dataAndTitle);
      }
      catch(err) {
        showDialogMessage("Oops! Something went wrong: " + err.message)
      }
      
    }
    else {
      showDialogMessage("Please select a valid CSV file")
    }
  }

  const showDialogMessage = message => {
    if (message) {
      dialogMessage = message
    }
    dialog.showModal()
  }

</script>

<!-- based on https://codepen.io/MSEdgeDev/pen/KzzNaZ -->
<div id="wrapper" class="wrapper">
  <div 
    id="fileDropBox"
    class="fileDropBox"
    class:active={hovering}
    class:inactive={!hovering}
    on:mouseenter={isHovering}
    on:mouseleave={isNotHovering}
    on:dragenter={isHovering} 
    on:dragleave={isNotHovering}  
    on:drop={handleDragDrop} 
    on:click={_ => hiddenInput.click()}
    ondragover="return false"
  >
    <h2 class="import-cta">{langs['load'][$settings.lang]}</h2>
    <p class="import-detail">{langs['box'][$settings.lang]}</p>
  </div>
</div>
<input type="file" bind:this={hiddenInput} style="visibility:hidden" on:change={handleFileSelected}>
<dialog style="background-color: #FFCC66;" bind:this={dialog}>
  <div style="display:flex; width:100%; justify-content:flex-end;">
    <button style="background-color: transparent; border:none; padding:0; margin:0" on:click={_ => dialog.close()}><CloseIcon /></button>
  </div>
  <div>
    {dialogMessage}
  </div>
</dialog>

<style>
* {
    font-family: segoe, sans-serif;
  }

 .wrapper {
    width:500px;
    margin:0 auto;
    margin-top:40px;
  }

  .fileDropBox {
    /* margin-left:100px; */
    width: 20em;
    text-align: center;
    color: gray;
    border-radius: 7px;
    cursor: pointer;
  }

  .import-cta {
    /* color: var(--color); */
    text-decoration: underline;
    margin-top: 2em;
  }

  .import-detail {
    
    margin-bottom: 2em;
    margin-left: 2em;
    margin-right: 2em;
    pointer-events: none;
  }

  .inactive {
    border: 10px dashed lightgray;
  }

  .active {
    border: 10px dashed grey;
  }
</style>