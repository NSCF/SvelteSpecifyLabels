<script>
	import Modal from 'svelte-simple-modal'
	import ChooseFile from './ChooseFile.svelte'
	import LabelLayout from './LabelLayout.svelte'
	import Papa from 'papaparse'

	import mapRecord from '../functions/kznHerpsMapFunc.js'
	import getAuthorities from '../functions/getTaxonAuthorities.js'
	
	let toLabels = false
	let data = []
	let taxonAuthoritiesChecked = false
	let authorities
	let propogateIncludeTaxonAuthorities = false //we use this to send the instruction down once we have fetched the authorities

	let showInstitution = false
	let collectionName
	let labelPerSpecimen = false
	let detLabel = true
	let includePunch = true
	let includeTaxonAuthorities = false
	let showFetchingAuthorites = false

	$: includeTaxonAuthorities, updateTaxonAuthorities()

	const updateTaxonAuthorities = async _ => {
		if(data.length) {
			if(includeTaxonAuthorities && !taxonAuthoritiesChecked){
				showFetchingAuthorites = true
				authorities = await getAuthorities(data)
				showFetchingAuthorites = false
				taxonAuthoritiesChecked = true
				propogateIncludeTaxonAuthorities = true
			}
			propogateIncludeTaxonAuthorities = includeTaxonAuthorities
		} 
		
	}

	let mapped
	const handleFileSelected = (ev) => {
		let file = ev.detail.file
		Papa.parse(file, { 
			header: true,
			complete:async results => {
				console.log(`${results.data.length} records read for labels`)
				console.log('raw data:')
				console.log(results.data[0])

				for (let raw of results.data){
					data.push(mapRecord(raw))
				}

				console.log('mapped:')
				console.log(data[0])

				//sort them
				data.sort((a, b) => {
					if (a.storageBox < b.storageBox){
						return -1;
					}
					if ( a.storageBox > b.storageBox ){
						return 1;
					}
					if (a.catalogNumber < b.catalogNumber){
						return -1;
					}
					if ( a.catalogNumber > b.catalogNumber ){
						return 1;
					}
					return 0;
				})

				if(includeTaxonAuthorities && !taxonAuthoritiesChecked){
					await updateTaxonAuthorities()
				}
				toLabels = true;
			}
		})
	}

	const showPrint = _ => {
		window.print()
	}

</script>

<main>
	<Modal>
		<div id='topstuff'> <!-- apologies to anyone reading this -->
			<h2>Let's make some labels</h2>
			<label style="display:inline">
				<input type=checkbox bind:checked={labelPerSpecimen}>
				Make labels for each specimen
			</label>
			<br/>
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
				<input type=checkbox bind:checked={includePunch}>
				Include punch mark
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={includeTaxonAuthorities}>
				Include taxon authorities
			</label>
			{#if showFetchingAuthorites}
				<span>   one moment please, this might take a few minutes...</span>
			{/if}
			<br/>
			<button on:click={showPrint} disabled={!toLabels}>Let's print these babies!!</button>
			{#if !toLabels}
			<ChooseFile on:file-selected={handleFileSelected} fileMIMETypes={['text/csv', 'application/vnd.ms-excel']}></ChooseFile>
			{/if}
			<hr/>
		</div>
		{#if toLabels}
			<div>
				<LabelLayout inputData={data} {labelPerSpecimen} {showInstitution} {detLabel} {includePunch} includeTaxonAuthorities={propogateIncludeTaxonAuthorities} {authorities} {collectionName}></LabelLayout>
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