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
	import exampleData from '../exampleData'

	let title="Svelte Labels"

	let langOptions = ['en', 'afr']
	
	let toFieldMappings = false
	let toLabels = false

	let rawData = []
	let labelData = []

	const numberInputSettings = {
		fontSize: {
			min: 6,
			max: 24,
			default: 12
		},
		lineHeight: {
			min: 90,
			max: 120,
			default: 100
		},
		labelWidth: {
			min: 2.5,
			max: 10,
			default: 5
		}
	}

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
    includeFieldNumber: false,
		underline: false,
    italics: false,
		addPrintedDate: false,
		font: 'Roboto Condensed',
		fontSize: numberInputSettings.fontSize.default,
		fontWeight: 400,
		lineHeight: numberInputSettings.lineHeight.default,
		labelWidth: numberInputSettings.labelWidth.default
	})

	const fonts = ["Roboto Condensed", "Courier", 'PT Sans Narrow', 'Arial']
	//only include fonts here where we want to give the user an option to choose
	const fontWeights = {
		"Roboto Condensed": [100, 200, 300, 400]
	}

	$: if( !($settings.font in fontWeights) ) $settings.fontWeight = 400

	const fontCheck = new Set([
		// Windows 10
	'Arial', 'Arial Black', 'Arial Narrow', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic',
		// macOS
		'American Typewriter', 'Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Courier', 'Courier New', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Impact', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand', 'Tahoma', 'Times', 'Times New Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Zapfino',
	].sort());


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
	
	$: $settings, mapAndSortRawData()

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

	const sortOnLabelFields = (a,b) => {

		if (a.catalogNumber && !b.catalogNumber){
			return -1
		}

		if (!a.catalogNumber && b.catalogNumber) {
			return 1
		}

		if (a.catalogNumber && b.catalogNumber ) {
			if (a.catalogNumber < b.catalogNumber) {
				return -1;
			}
			if ( a.catalogNumber > b.catalogNumber ){
				return 1;
			}
		}

		if (a.recordNumber && b.recordNumber) {
			if (a.recordNumber < b.recordNumber){
				return -1;
			}
			if ( a.recordNumber > b.recordNumber ){
				return 1;
			}
		}

		return 0

	}

	const mapAndSortRawData = _ => {
		if (rawData.length) {

			labelData = rawData.map(raw => mapRecord(raw, $fieldMappings, $settings.useRomanNumeralMonths, true))
			if ($settings.excludeNoCatnums) {
				labelData = labelData.filter(x => x.catalogNumber || x.recordNumber)
			}
			//sort first on storage location, then catalog number, then collector number
			labelData.sort((a, b) => {
				if ($settings.showStorage) {
					if (a.storageBox < b.storageBox){
						return -1;
					}
					if ( a.storageBox > b.storageBox ){
						return 1;
					}
					if ( a.storageBox == b.storageBox ){
						return sortOnLabelFields(a, b)
					}
					return 0;
				}
				else {
					return sortOnLabelFields(a, b)
				}
			})

		}
	}

	const makeLabelData = _ => {

		const datasetFieldMappings = getFieldMappings(rawData[0])

		// check if there's a previous field mapping
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
	}

	const handleFileSelected = async ev => {
		let file = ev.detail.file
		if(file.type.endsWith('json')){
			try {
				rawData = await readJSON(file)
				
			}
			catch(err) {
				alert(err.message)
				return
			}
		}
		else {
			try {
				rawData = await readCSV(file)
			}
			catch(err) {
				alert('Oops! Something went wrong...')
				return
			}
		}

		title = file.name.replace(/\.[a-z]+$/i, '').trim()
		if (!title.toLowerCase().includes('label')) {
			title += ' labels'
		}

		makeLabelData()
		toLabels = true

	}

	const showPrint = _ => {
		localStorage.setItem('labelSettings', JSON.stringify($settings))
		window.print()
	}

	const handleNumberInputKeyboardInput = input => {
		if ($settings[input] > numberInputSettings[input].max ) {
			$settings[input] = numberInputSettings[input].max
		}

		if ($settings[input] < numberInputSettings[input].min ) {
			$settings[input] = numberInputSettings[input].min
		}
	}

	const handLangButtonClick = _ => {
		const langIndex = langOptions.indexOf($settings.lang)
		const nextIndex = langIndex + 1
		if (langOptions.length > nextIndex) {
			$settings.lang = langOptions[nextIndex]
		}
		else {
			$settings.lang = langOptions[0]
		}
	}

	const showData = _ => {
		console.log(labelData)
	}

	const clear = _ => {
		rawData = []
		labelData = []
		toLabels = false
		title="Svelte Labels"
	}

	// keep this just in case we need it again later
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
    $settings.includeFieldNumber = false
		$settings.underline = false
    $settings.italics = false
		$settings.addPrintedDate = false
		$settings.printerModel = null
		$settings.font = "Roboto Condensed"
		$settings.fontSize = numberInputSettings.fontSize.default
		$settings.fontWeight = 400
		$settings.lineHeight = numberInputSettings.lineHeight.default
		$settings.labelWidth = numberInputSettings.labelWidth.default

		localStorage.removeItem('labelSettings')

	}

	const closeMappings = _ => {
		toFieldMappings = false
		toLabels = true
	}

	const gotoExampleData = _ => {
		window.open('https://docs.google.com/spreadsheets/d/17GK3ET4YRysCzieaSZAwn4mOyt3dBvTwlocZSIVPFgc/edit?usp=sharing', '_blank').focus();
	}

	const addExampleLabels = _ => {
		rawData = exampleData
		makeLabelData()
		toLabels = true
	}

</script>
<svelte:head>
	<title>{title}</title>
</svelte:head>
<main>
	<Modal>
		<div id='topstuff'> <!-- apologies to anyone reading this -->
			{#if !toFieldMappings}
			<div style="display:flex; justify-content: space-between ">
				<h2>{langs[$settings.lang]['header']}</h2>
				<button class="secondary-button" on:click={handLangButtonClick}>{$settings.lang}</button>
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
  		<input type="text" bind:value={$settings.collectionName} style="display:inline; margin:0;height:10px" placeholder="Collection name..."><br>
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
      <label style="display:inline">
				<input type=checkbox bind:checked={$settings.includeFieldNumber}>
				Include field number
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.underline}>
				{langs[$settings.lang]['underline']}
			</label>
			<br/>
      <label style="display:inline">
				<input type=checkbox bind:checked={$settings.italics}>
				italics for scientific names
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.addPrintedDate}>
				{langs[$settings.lang]['printDate']}
			</label>
			<br/>
			{#if $settings.addPrintedDate}
  		<input type="text" bind:value={$settings.printerModel} style="display:inline; margin:0;height:10px" placeholder="Printer make and model"><br>
			<br/>
			{/if}
			<div style="display:flex; gap:5px">
				<div>
					<label>{langs[$settings.lang]['font']}</label>
					<select bind:value={$settings.font}>
						{#each fonts as font}
						<option value={font}>{font}</option>
						{/each}
					</select>
				</div>
				{#if $settings.font in fontWeights}
				<div>
					<label>{langs[$settings.lang]['fontWeight']}</label>
					<select bind:value={$settings.fontWeight}>
						{#each fontWeights[$settings.font] as weightOption}
						<option value={weightOption}>{weightOption}</option>
						{/each}
					</select>
				</div>
				{/if}
				<div>
					<label>{langs[$settings.lang]['fontSize']}</label>
					<input type="number" min={numberInputSettings.fontSize.min} max={numberInputSettings.fontSize.max} on:keyup={_ => handleNumberInputKeyboardInput('fontSize')} on:mousewheel|preventDefault bind:value={$settings.fontSize} >
				</div>
				<div>
					<label>{langs[$settings.lang]['lineHeight']}</label>
					<input type="number" min={numberInputSettings.lineHeight.min} max={numberInputSettings.lineHeight.max} step="5"  on:keyup={_ => handleNumberInputKeyboardInput('lineHeight')} on:mousewheel|preventDefault bind:value={$settings.lineHeight} >
				</div>
				<div>
					<label>{langs[$settings.lang]['labelWidth']}</label>
					<div style="display:flex; align-items: baseline; ">
						<input type="number" min={numberInputSettings.labelWidth.min} max={numberInputSettings.labelWidth.max} step=".5" on:keyup={_ => handleNumberInputKeyboardInput('labelWidth')} on:mousewheel|preventDefault bind:value={$settings.labelWidth} >
						<span>{langs[$settings.lang]['labelWidthUnit']}</span>
					</div>
				</div>
			</div>
			<p style="position:relative; margin:0; top:-1em; font-size:.7em">{langs[$settings.lang]['saveSettings']}</p>
			<div style="display:flex; justify-content: space-between">
				<div style="display:flex; flex-direction:row;">
					<!-- <button class="secondary-button" on:click={showData}>show data</button> -->
					<button class="secondary-button" on:click={clear}>{langs[$settings.lang]['clear']}</button>
					<!-- <button class="secondary-button" on:click={reset}>{langs[$settings.lang]['reset']}</button> -->
					<button class="secondary-button" on:click={_ => {toLabels=false; toFieldMappings=true}}>{langs[$settings.lang]['mappings'].toLowerCase()}</button>
				</div>
				<button on:click={showPrint} disabled={!toLabels}>{langs[$settings.lang]['printButton']}</button>
			</div>
			{/if}
			{#if !toLabels && !toFieldMappings}
			<ChooseFile on:file-selected={handleFileSelected} fileMIMETypes={['text/csv', 'application/vnd.ms-excel', 'text/json', 'application/json']}></ChooseFile>
			<div style="width:100%; display: flex; justify-content:flex-end">
				<button class="secondary-button" on:click={gotoExampleData}>{langs[$settings.lang]['exampleData']}</button>
				<button class="secondary-button" on:click={addExampleLabels}>{langs[$settings.lang]['exampleLabels']}</button>
			</div>
			{/if}
			<hr/>
		</div>
		
		{#if toFieldMappings}
		<FieldMappings record={rawData[1]} on:mappings-updated={makeLabelData} on:close-mappings={closeMappings}/>
		{/if}
		{#if toLabels}
			<div class="label-section">
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

.secondary-button {
	background-color: transparent; 
	border: 1px solid transparent; 
	color:grey;
}

.secondary-button:hover {
	border: 1px solid gray
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