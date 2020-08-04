<script>
import {getContext, createEventDispatcher } from 'svelte';
import Alert from './Alert.svelte'

const dispatch = createEventDispatcher();
const { open } = getContext('simple-modal');

//PROPS
export let fileMIMETypes

//LOCALS
let hiddenInput
let hovering = false

//COMPUTED

//WATCHERS

//METHODS
function handleMouseOver(evt){
  evt.stopPropagation(); // Do not allow the dragover event to bubble.
  evt.preventDefault(); // Prevent default dragover event behavior.
  hovering = true
}

function handleMouseout(evt){
  evt.stopPropagation(); // Do not allow the dragover event to bubble.
  evt.preventDefault(); // Prevent default dragover event behavior.
  hovering = false
}

function handleDragEnter(evt){
  evt.stopPropagation(); // Do not allow the dragover event to bubble.
  evt.preventDefault(); // Prevent default dragover event behavior.
  hovering = true
}

function handleDragLeave(evt){
  evt.stopPropagation(); // Do not allow the dragover event to bubble.
  evt.preventDefault(); // Prevent default dragover event behavior.
  hovering = false
}

function handleBoxClick(evt){
  hiddenInput.click()
}

function onFileSelected() {
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

//HELPERS
function toEmitOrNotToEmit(file){
  if(file && (fileMIMETypes.includes(file.type))){
    dispatch('file-selected', {
      file
    });
  }
  else {
    open(Alert, 
    { message: "Please select a valid CSV file" }, 
    {
      closeButton:false,
      styleWindow: { 
        backgroundColor:'#f2dede', 
        'border-color': 'blue'
      }
    });
  }
}

</script>

<!--##############################################-->
<!--
  based on https://codepen.io/MSEdgeDev/pen/KzzNaZ
-->
<div id="wrapper" class="wrapper">
  <div 
    id="fileDropBox"
    class="fileDropBox"
    class:active={hovering}
    class:inactive={!hovering}
    on:mouseenter={handleMouseOver}
    on:mouseleave={handleMouseout}
    on:dragenter={handleDragEnter} 
    on:dragleave={handleDragLeave}  
    on:drop={handleDragDrop} 
    on:click={handleBoxClick}
    ondragover="return false"
  >
    <p>Drag and drop a Specify query result file here or click to select</p>
  </div>
</div>
<input type="file" bind:this={hiddenInput} style="visibility:hidden" on:change={onFileSelected}>

<!--##############################################-->
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
    margin-left:100px;
    width: 20em;
    text-align: center;
    color: gray;
    border-radius: 7px;
  }

  p {
    margin-top: 5em;
    margin-bottom: 5em;
    margin-left: 2em;
    margin-right: 2em;
  }

  .inactive {
    border: 10px dashed lightgray;
  }

  .active {
    border: 10px dashed grey;
  }
</style>