<script>
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store';
	import Modal from 'svelte-simple-modal'
	import ChooseFile from './ChooseFile.svelte'
	import Settings from './Settings.svelte';
	import LabelLayout from './LabelLayout.svelte'
	import FieldMappings from './FieldMappings.svelte';
	import getFieldMappings from '../lib/getFieldMappings'
	import langs from '../i18n/lang'
	import exampleData from '../exampleData'
	import defaultSettings from '../lib/settings'
	import mapRecord from '../lib/mapRecord';
	import sortLabelData from '../lib/sortLabelData'

	let title="Svelte Labels"

	let langOptions = ['en', 'afr']
	
	let toFieldMappings = false
	let toLabels = false

	let rawData = []
	let labelData = []

	let settings = writable(defaultSettings)

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
	
	$: $settings, makeLabelData()

	let fieldMappings = writable({})
	setContext('mappings', fieldMappings)



	//This runs when new raw data are added
	const makeLabelData = _ => {

		if (rawData.length) {
			//sort out field mappings
			let newFieldMappings = getFieldMappings(rawData[0])
			const savedFieldMappingsJSON = localStorage.getItem("fieldMappings")
			if (savedFieldMappingsJSON) {
				const savedFieldMappings = JSON.parse(savedFieldMappingsJSON)
				if (Object.keys(savedFieldMappings).length){
					// remove any fields that may not be in the new dataset
					for (const [labelField, mappedDatasetField] of Object.entries(savedFieldMappings)) {
						if (!(mappedDatasetField in rawData[0])) {
							savedFieldMappings[labelField] = null
						}
					}
					newFieldMappings = savedFieldMappings
				}
			}
			fieldMappings = writable(newFieldMappings)

			labelData = rawData.map(raw => mapRecord(raw, $fieldMappings, $settings.useRomanNumeralMonths))
			
			sortLabelData()

			if ($settings.excludeNoCatnums) {
				labelData = labelData.filter(x => x.catalogNumber || x.recordNumber)
			}
		}
	}

	const handleFileDataAndTitle = async ev => {
		
		let payload = ev.data 
		rawData = payload.data
		title = payload.title
		makeLabelData()
		toLabels = true

	}

	const showPrint = _ => {
		localStorage.setItem('labelSettings', JSON.stringify($settings))
		window.print()
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

	window.showData = _ => {
		console.log(labelData)
	}

	const clear = _ => {
		rawData = []
		labelData = []
		toLabels = false
		title="Svelte Labels"
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
			{#if toFieldMappings}
			<FieldMappings record={rawData[1]} on:mappings-updated={makeLabelData} on:close-mappings={closeMappings}/>
			{/if}
			{#if !toLabels && !toFieldMappings}
			<ChooseFile on:data={handleFileDataAndTitle} />
			<div style="width:100%; display: flex; justify-content:flex-end">
				<button class="secondary-button" on:click={gotoExampleData}>{langs[$settings.lang]['exampleData']}</button>
				<button class="secondary-button" on:click={addExampleLabels}>{langs[$settings.lang]['exampleLabels']}</button>
			</div>
			{/if}
			{#if toLabels}
			<Settings />
			<div style="display:flex; justify-content: space-between">
				<div style="display:flex; flex-direction:row;">
					<!-- <button class="secondary-button" on:click={showData}>show data</button> -->
					<button class="secondary-button" on:click={clear}>{langs[$settings.lang]['clear']}</button>
					<!-- <button class="secondary-button" on:click={reset}>{langs[$settings.lang]['reset']}</button> -->
					<button class="secondary-button" on:click={_ => {toLabels=false; toFieldMappings=true}}>{langs[$settings.lang]['mappings'].toLowerCase()}</button>
				</div>
				<button on:click={showPrint} disabled={!toLabels}>{langs[$settings.lang]['printButton']}</button>
			</div>
			<hr/>
			<div class="label-section">
				<LabelLayout inputData={labelData} />
			</div>
			{/if}
		</div>
	</Modal>
</main>

<style>
 main {
	 margin:1cm;
	 padding: 0px;
	 border-top: 1px solid rgb(168, 168, 168);
 }

 hr {
	 margin:0;
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