<script>
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store';
	import Modal from 'svelte-simple-modal'
	import ChooseFile from './ChooseFile.svelte'
	import LabelLayout from './LabelLayout.svelte'
	import readCSV from '../lib/readCSVInput'
	import readJSON from '../lib/readJSONInput'
	import langs from '../i18n/lang'

	let langOptions = ['en', 'afr']
	
	let toLabels = false
	let data = []

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
		detLabel: true,
		detLabelOnly: false,
		showStorage: false,
		includePunch: false,
		includeTaxonAuthorities: false,
		fontSize: defaultFontSize,
		labelWidth: defaultLabelWidth
	})

	if (localStorage.getItem("labelSettings") != null) {
		$settings = JSON.parse(localStorage.getItem("labelSettings"))
	}

	setContext('settings', settings)

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

	const reset = _ => {
		data = []
		toLabels = false
		localStorage.removeItem('labelSettings')
		$settings.showInstitution = false
		$settings.collectionName = null
		$settings.labelPerSpecimen = false
		$settings.labelCountField = null
		$settings.detLabel = true
		$settings.detLabelOnly = false
		$settings.showStorage = false
		$settings.includePunch = false
		$settings.includeTaxonAuthorities = false
		$settings.fontSize = defaultFontSize
		$settings.labelWidth = defaultLabelWidth
	}

</script>

<main>
	<Modal>
		<div id='topstuff'> <!-- apologies to anyone reading this -->
			<div style="display:flex; justify-content: space-between ">
				<h2>{langs[$settings.lang]['header']}</h2>
				<button style="background-color: transparent; border:none; color:grey" on:click={handLangButtonClick}>{$settings.lang}</button>
			</div>
			{#if toLabels}
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.labelPerSpecimen}>
				{langs[$settings.lang]['count']}
			</label>
			<br/>
			{#if $settings.labelPerSpecimen && data.length}
			<select bind:value={$settings.labelCountField}>
				<option value=""></option>
				{#each Object.keys(data[0]).filter(x => x.toLowerCase().endsWith('count') || x.toLowerCase().endsWith('counts')) as key}
					<option value="{key}">{key}</option>
				{/each}
			</select>
			{/if}
			<label style="display:inline">
				<input type=checkbox bind:checked={$settings.showInstitution}>
				{langs[$settings.lang]['collName']}
			</label>
			{#if $settings.showInstitution}
  		<input type="text" name="gender" id="male" bind:value={$settings.collectionName} style="display:inline; margin:0;height:10px" placeholder="Add collection..."><br>
			{/if}
			<br/>
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
				<button style="background-color: transparent; border:none; color:grey" on:click={reset}>{langs[$settings.lang]['reset']}</button>
			</div>
			{/if}
			{#if !toLabels}
			<ChooseFile on:file-selected={handleFileSelected} fileMIMETypes={['text/csv', 'application/vnd.ms-excel', 'text/json', 'application/json']}></ChooseFile>
			{/if}
			<hr/>
		</div>
		{#if toLabels}
			<div>
				<LabelLayout inputData={data} />
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