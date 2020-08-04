<script>
	import Modal from 'svelte-simple-modal'
	import ChooseFile from './ChooseFile.svelte'
	import LabelLayout from './LabelLayout.svelte'
	import Papa from 'papaparse'
	
	let toLabels = false
	let data = []

	let showInstitution = false
	let collectionName
	let labelPerSpecimen = false
	let detLabel = true
	let includePunch = true

	const handleFileSelected = (ev) => {
		let file = ev.detail.file
		Papa.parse(file, { header: true,
			step: function(row) {
				data.push(row.data)
			},
			complete: function() {
				console.log(`${data.length} records read for labels`)
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
			<button on:click={showPrint} disabled={!toLabels}>Let's print these babies!!</button>
			{#if !toLabels}
			<ChooseFile on:file-selected={handleFileSelected} fileMIMETypes={['text/csv', 'application/vnd.ms-excel']}></ChooseFile>
			{/if}
			<hr/>
		</div>
		{#if toLabels}
			<div>
				<LabelLayout inputData={data} {labelPerSpecimen} {showInstitution} {detLabel} {includePunch} {collectionName}></LabelLayout>
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