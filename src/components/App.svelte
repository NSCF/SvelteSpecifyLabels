<script>
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store';
	import Modal from 'svelte-simple-modal'
	import ChooseFile from './ChooseFile.svelte'
	import LabelLayout from './LabelLayout.svelte'
	import FieldMappings from './FieldMappings.svelte';
	import readCSV from '../lib/readCSVInput'
	import readJSON from '../lib/readJSONInput'
	import getFieldMappings from '../lib/getFieldMappings'
	import mapRecord from '../lib/mapRecord'
	import langs from '../i18n/lang'

	let langOptions = ['en', 'afr']
	
	let toFieldMappings = false
	let toLabels = false

	let rawData = []
	let labelData = []

	const maxFontSize = 24
	const minFontSize = 6
	const defaultFontSize = 12
	const maxLabelWidth = 10
	const minLabelWidth = 2
	const defaultLabelWidth = 5

	let settings = writable({
		lang: 'en',
		showInstitution: false,
		collectionName: null,
		labelPerSpecimen: false,
		labelCountField: null,
		useRomanNumeralMonths: false,
		detLabel: true,
		detLabelOnly: false,
		italicizeNames: false,
		showStorage: false,
		includePunch: false,
		includeTaxonAuthorities: false,
		excludeNoCatnums: false,
		fontSize: defaultFontSize,
		labelWidth: defaultLabelWidth
	})

	if (localStorage.getItem("labelSettings") != null) {
		// so we can handle evolution of settings...
		const savedSettings = JSON.parse(localStorage.getItem("labelSettings"))
		for (const [key, val] of Object.entries(savedSettings)) {
			if (key in $settings) {
				$settings[key] = val
			}
		}
	}

	setContext('settings', settings)
	
	$: $settings.useRomanNumeralMonths, rawData.length? mapAndSortRawData() : null

	let fieldMappings

	if (localStorage.getItem("fieldMappings") != null) {
		// so we can handle evolution of settings...
		const savedFieldMappings = JSON.parse(localStorage.getItem("fieldMappings"))
		fieldMappings = writable(savedFieldMappings)
	}
	else {
		fieldMappings = writable({})
	}

	setContext('mappings', fieldMappings)

	const mapAndSortRawData = _ => {
		if (rawData.length) {

			const mappedAndSorted = rawData.map(raw => mapRecord(raw, $fieldMappings, $settings.useRomanNumeralMonths))
			//sort first on storage location, then catalog number, then collector number
			mappedAndSorted.sort((a, b) => {
				if (a.storageBox < b.storageBox){
					return -1;
				}
				if ( a.storageBox > b.storageBox ){
					return 1;
				}
				if ( a.storageBox == b.storageBox ){
					if (a.catalogNumber < b.catalogNumber){
						return -1;
					}
					if ( a.catalogNumber > b.catalogNumber ){
						return 1;
					}
					if ( a.catalogNumber == b.catalogNumber ){
						if (a.collectorNumber < b.collectorNumber){
							return -1;
						}
						if ( a.collectorNumber > b.collectorNumber ){
							return 1;
						}
					}
				}
				return 0;
			})

			labelData = mappedAndSorted

		}
	}

	const handleFileSelected = async ev => {
		let file = ev.detail.file
		if(file.type.endsWith('json')){
			try {
				rawData = await readJSON(file)
				
			}
			catch(err) {
				alert(err.message)
			}
		}
		else {
			try {
				rawData = await readCSV(file)
			}
			catch(err) {
				alert('Oops! Something went wrong...')
			}
		}

		const datasetFieldMappings = getFieldMappings(rawData[0])
		if (Object.keys($fieldMappings).length == 0) {
			$fieldMappings = datasetFieldMappings
		}
		else {

			//here we need to check if any previously mapped fields are still in the fieldMapping
			for (const [labelField, mappedDatasetField] of Object.entries($fieldMappings)) {
				if (mappedDatasetField == null || mappedDatasetField in rawData[0]) {
					continue
				}
				else {
					$fieldMappings[labelField] = null
				}
			}

			// there might be fields added in the new dataset but the user will have to fix that manually
			
		}

		mapAndSortRawData()
		toLabels = true
	}

	const showPrint = _ => {
		localStorage.setItem('labelSettings', JSON.stringify($settings))
		window.print()
	}

	const handleFontSizeKeyboardInput = _ => {
		
		if (fontSize > maxFontSize ) {
			alert(`max font size is ${maxFontSize}`)
			fontSize = defaultFontSize
		}

		if (fontSize < minFontSize ) {
			alert(`min font size is ${minFontSize}`)
			fontSize = defaultFontSize
		}
	}

	const handleLabelWidthKeyboardInput = _ => {
		
		if (labelWidth > maxLabelWidth ) {
			alert(`max label width is ${maxLabelWidth}`)
			labelWidth = defaultLabelWidth
		}

		if (labelWidth < minLabelWidth ) {
			alert(`min label width is ${minLabelWidth}`)
			labelWidth = defaultLabelWidth
		}
	}

	const handLangButtonClick = ev => {
		const langIndex = langOptions.indexOf($settings.lang)
		const nextIndex = langIndex + 1
		if (langOptions.length > nextIndex) {
			$settings.lang = langOptions[nextIndex]
		}
		else {
			$settings.lang = langOptions[0]
		}
	}

	const clear = _ => {
		rawData = []
		labelData = []
		toLabels = false
	}

	const reset = _ => {
		
		$settings.showInstitution = false
		$settings.collectionName = null
		$settings.labelPerSpecimen = false
		$settings.labelCountField = null
		$settings.useRomanNumeralMonths = false
		$settings.detLabel = true
		$settings.detLabelOnly = false
		$settings.italicizeNames = false
		$settings.showStorage = false
		$settings.includePunch = false
		$settings.includeTaxonAuthorities = false
		$settings.excludeNoCatnums = false
		$settings.fontSize = defaultFontSize
		$settings.labelWidth = defaultLabelWidth

		localStorage.removeItem('labelSettings')
	}

</script>

<main>
	<Modal>
		<div id='topstuff'> <!-- apologies to anyone reading this -->
			{#if !toFieldMappings}
			<div style="display:flex; justify-content: space-between ">
				<h2>{langs[$settings.lang]['header']}</h2>
				<button style="background-color: transparent; border:none; color:grey" on:click={handLangButtonClick}>{$settings.lang}</button>
			</div>
			{/if}
			{#if toLabels}
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.labelPerSpecimen}>
				{langs[$settings.lang]['count']}
			</label>
			<br/>
			{#if $settings.labelPerSpecimen && labelData.length}
			<select bind:value={$settings.labelCountField}>
				<option value=""></option>
				{#each Object.keys(labelData[0]).filter(x => x.toLowerCase().endsWith('count') || x.toLowerCase().endsWith('counts')) as key}
					<option value="{key}">{key}</option>
				{/each}
			</select>
			{/if}
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.useRomanNumeralMonths}>
				{langs[$settings.lang]['romanNums']}
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.showInstitution}>
				{langs[$settings.lang]['collName']}
			</label>
			<br/>
			{#if $settings.showInstitution}
  		<input type="text" name="gender" id="male" bind:value={$settings.collectionName} style="display:inline; margin:0;height:10px" placeholder="Collection name..."><br>
			<br/>
			{/if}
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.detLabel}>
				{langs[$settings.lang]['dets']}
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.detLabelOnly}>
				{langs[$settings.lang]['detsOnly']}
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.includePunch}>
				{langs[$settings.lang]['punch']}
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.showStorage}>
				{langs[$settings.lang]['storage']}
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.includeTaxonAuthorities}>
				{langs[$settings.lang]['authors']}
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.excludeNoCatnums}>
				{langs[$settings.lang]['excludeCatNums']}
			</label>
			<br/>
			<div style="display:flex; gap:5px">
				<div>
					<label>{langs[$settings.lang]['fontSize']}</label>
					<input type="number" min={minFontSize} max={maxFontSize} on:keyup={handleFontSizeKeyboardInput} bind:value={$settings.fontSize} >
				</div>
				<div>
					<label>{langs[$settings.lang]['labelWidth']}</label>
					<div style="display:flex; align-items: baseline; ">
						<input type="number" min={minLabelWidth} max={maxLabelWidth} step=".5" on:keyup={handleLabelWidthKeyboardInput} bind:value={$settings.labelWidth} >
						<span>{langs[$settings.lang]['labelWidthUnit']}</span>
					</div>
				</div>
			</div>
			<br/>
			<div style="display:flex; justify-content: space-between">
				<button on:click={showPrint} disabled={!toLabels}>{langs[$settings.lang]['printButton']}</button>
				<div>
					<button style="background-color: transparent; border:none; color:grey" on:click={clear}>{langs[$settings.lang]['clear']}</button>
					<button style="background-color: transparent; border:none; color:grey" on:click={reset}>{langs[$settings.lang]['reset']}</button>
					<button style="background-color: transparent; border:none; color:grey" on:click={_ => {toLabels=false; toFieldMappings=true}}>{langs[$settings.lang]['mappings'].toLowerCase()}</button>
				</div>
			</div>
			{/if}
			{#if !toLabels && !toFieldMappings}
			<ChooseFile on:file-selected={handleFileSelected} fileMIMETypes={['text/csv', 'application/vnd.ms-excel', 'text/json', 'application/json']}></ChooseFile>
			{/if}
			<hr/>
		</div>
		{#if toFieldMappings}
		<FieldMappings record={rawData[0]} on:settings-saved={_ => {toFieldMappings = false; toLabels = true}}/>
		{/if}
		{#if toLabels}
			<div>
				<LabelLayout inputData={labelData} />
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
		main {
			margin-top:0;
		}

    #topstuff
    {
        display: none !important;
    }
}

</style>