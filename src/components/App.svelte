<script>
	import Modal from 'svelte-simple-modal'
	import ChooseFile from './ChooseFile.svelte'
	import LabelLayout from './LabelLayout.svelte'
	import Papa from 'papaparse'

	import mapRecord from '../functions/kznHerpsMapFunc.js'

	import getAuthorities from '../functions/getTaxonAuthorities.js'
	
	let toLabels = false
	let data = []
	let authorities = {}
	let propogateIncludeTaxonAuthorities = false //we use this to send the instruction down once we have fetched the authorities

	let showInstitution = false
	let collectionName
	let labelPerSpecimen = false
	let detLabel = true
	let showStorage = false
	let includePunch = false
	let includeTaxonAuthorities = false
	let showFetchingAuthorites = false

	$: data, authorities, updateTaxonAuthorities()
	$: includeTaxonAuthorities, updateTaxonAuthorities()

	const updateTaxonAuthorities = async _ => {
		if(data && data.length) {
			if(includeTaxonAuthorities){
				//first check if we already have the authorities
				const taxaWithNoAuthority = new Set()
				for (const record of data) {
					if(record.canonicalName && !record.scientificNameAuthorship) {
						if(authorities.hasOwnProperty(record.canonicalName)) {
							record.scientificNameAuthorship = authorities[record.canonicalName]
						}
						else {
							taxaWithNoAuthority.add(record.canonicalName)
						}
					}
				}

				if(taxaWithNoAuthority.size){
					showFetchingAuthorites = true
					const newAuthorities = await getAuthorities(Array.from(taxaWithNoAuthority))
					authorities = {...authorities, ...newAuthorities} //this triggers this function to run again...
					showFetchingAuthorites = false
					propogateIncludeTaxonAuthorities = true
				}
			}

			propogateIncludeTaxonAuthorities = includeTaxonAuthorities

			toLabels = true;

		} 
		
	}

	const handleFileSelected = ev => {
		let file = ev.detail.file
		console.log('file type:', file.type)
		if(file.type.endsWith('json')){
			console.log('reading json')
			file.text().then(fileText => {
				const json = JSON.parse(fileText)
				if(json && Array.isArray(json) && json.length){
					data = json.map(x => mapRecord(x))
					console.log(data[0])
				}
				else {
					console.error(json)
					alert('invalid json file, see console')
				}
			}).catch(err => console.error('error parsing JSON:', err.message))
		}
		else {
			console.log('reading csv')
			Papa.parse(file, { 
				header: true,
				complete: async results => {
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

				}
			})
		}
		
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
				<input type=checkbox bind:checked={showStorage}>
				Show storage info
			</label>
			<br/>
			<label style="display:inline">
				<input type=checkbox bind:checked={includeTaxonAuthorities}>
				Include taxon authorities
			</label>
			{#if showFetchingAuthorites}
				<span>   one moment please, this might take a few minutes (see the console)...</span>
			{/if}
			<br/>
			<button on:click={showPrint} disabled={!toLabels}>Let's print these babies!!</button>
			{#if !toLabels}
			<ChooseFile on:file-selected={handleFileSelected} fileMIMETypes={['text/csv', 'application/vnd.ms-excel', 'text/json', 'application/json']}></ChooseFile>
			{/if}
			<hr/>
		</div>
		{#if toLabels}
			<div>
				<LabelLayout inputData={data} {labelPerSpecimen} {showInstitution} {detLabel} {showStorage} {includePunch} includeTaxonAuthorities={propogateIncludeTaxonAuthorities} {authorities} {collectionName}></LabelLayout>
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