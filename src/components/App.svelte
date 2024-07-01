<script>
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store';
	import Modal from 'svelte-simple-modal'
	import ChooseFile from './ChooseFile.svelte'
	import LabelLayout from './LabelLayout.svelte'
	import readCSV from '../lib/readCSVInput'
	import readJSON from '../lib/readJSONInput'
	
	let toLabels = false
	let data = []
	
	let showInstitution = false
	let collectionName
	let labelPerSpecimen = false
	let detLabel = true
	let detLabelOnly = false
	let showStorage = false
	let includePunch = false
	let includeTaxonAuthorities = false

	let labelCountField = writable()
	setContext('labelCount', labelCountField)
	$: if (!labelPerSpecimen) {
		$labelCountField = null
	}

	const maxFontSize = 24
	const minFontSize = 6
	const defaultFontSize = 12

	const labelFontSize = writable(defaultFontSize)
	setContext('fontSize', labelFontSize)

	const maxLabelWidth = 10
	const minLabelWidth = 2
	const defaultLabelWidth = 5
	
	const labelWidth = writable(defaultLabelWidth)
	setContext('labelWidth', labelWidth)

	const handleFileSelected = async ev => {
		let file = ev.detail.file
		if(file.type.endsWith('json')){
			try {
				data = await readJSON(file)
				toLabels = true
			}
			catch(err) {
				alert(err.message)
			}
		}
		else {
			try {
				data = await readCSV(file)
				toLabels = true
			}
			catch(err) {
				alert('bugger!')
			}
		}
	}

	const showPrint = _ => {
		window.print()
	}

	const handleFontSizeKeyboardInput = event => {
		
		if ($labelFontSize > maxFontSize ) {
			alert(`max font size is ${maxFontSize}`)
			$labelFontSize = defaultFontSize
		}

		if ($labelFontSize < minFontSize ) {
			alert(`min font size is ${minFontSize}`)
			$labelFontSize = defaultFontSize
		}
	}

	const handleLabelWidthKeyboardInput = event => {
		
		if ($labelWidth > maxLabelWidth ) {
			alert(`max label width is ${maxLabelWidth}`)
			$labelWidth = defaultLabelWidth
		}

		if ($labelFontSize < minLabelWidth ) {
			alert(`min label width is ${minLabelWidth}`)
			$labelWidth = defaultLabelWidth
		}
	}

</script>

<main>
	<Modal>
		<div id='topstuff'> <!-- apologies to anyone reading this -->
			<h2>Let's make some labels</h2>
			{#if toLabels}
			<label style="display:inline">
				<input type=checkbox bind:checked={labelPerSpecimen}>
				Duplicate labels using count
			</label>
			<br/>
			{#if labelPerSpecimen && data.length}
			<select bind:value={$labelCountField}>
				<option value=""></option>
				{#each Object.keys(data[0]).filter(x => x.toLowerCase().endsWith('count') || x.toLowerCase().endsWith('counts')) as key}
					<option value="{key}">{key}</option>
				{/each}
			</select>
			{/if}
			<label style="display:inline">
				<input type=checkbox bind:checked={showInstitution}>
				Add my collection name
			</label>
			{#if showInstitution}
  		<input type="text" name="gender" id="male" bind:value={collectionName} style="display:inline; margin:0;height:10px" placeholder="Add collection..."><br>
			{/if}
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={detLabel}>
				Include det labels
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={detLabelOnly}>
				Make det labels only
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={includePunch}>
				Include punch mark
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={showStorage}>
				Show storage info
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={includeTaxonAuthorities}>
				Include taxon authorities
			</label>
			<br/>
			<div style="display:flex; gap:5px">
				<div>
					<label>Font size</label>
					<input type="number" min={minFontSize} max={maxFontSize} on:keyup={handleFontSizeKeyboardInput} bind:value={$labelFontSize}>
				</div>
				<div>
					<label>Label width</label>
					<div style="display:flex; align-items: baseline; ">
						<input type="number" min={minLabelWidth} max={maxLabelWidth} on:keyup={handleLabelWidthKeyboardInput} bind:value={$labelWidth}>
						<span>cm</span>
					</div>
				</div>
			</div>
			<br/>
			<div style="display:flex; justify-content: space-between">
				<button on:click={showPrint} disabled={!toLabels}>Print labels</button>
				<button style="background-color: transparent; border:none; color:grey" on:click={_ => toLabels = false}>reset</button>
			</div>
			{/if}
			{#if !toLabels}
			<ChooseFile on:file-selected={handleFileSelected} fileMIMETypes={['text/csv', 'application/vnd.ms-excel', 'text/json', 'application/json']}></ChooseFile>
			{/if}
			<hr/>
		</div>
		{#if toLabels}
			<div>
				<LabelLayout inputData={data} {showInstitution} {detLabel} {detLabelOnly} {showStorage} {includePunch} {collectionName} {includeTaxonAuthorities}></LabelLayout>
			</div>
		{/if}
	</Modal>
</main>

<style>
 main {
	 margin:1cm;
	 padding: 0px;
	 border-top: 1px solid rgb(168, 168, 168);
 }
 label{
	 font-size:1em;
 }
 hr {
	 margin:0;
 }

 input::after{
		content: none;
}

 @media print
{    
    #topstuff
    {
        display: none !important;
    }
}

</style>