<script>
	import Modal from 'svelte-simple-modal'
	import ChooseFile from './ChooseFile.svelte'
	import LabelLayout from './LabelLayout.svelte'
	import Papa from 'papaparse'

	export let name;
	
	let toLabels = false
	let data = []

	const handleFileSelected = (ev) => {
		let file = ev.detail.file
		Papa.parse(file, { header: true,
			step: function(row) {
				data.push(row.data)
			},
			complete: function() {
				console.log(data)
				console.log(`${data.length} records read for labels`)
				toLabels = true;
			}
		})
	}

</script>

<main>
	<Modal>
		{#if !toLabels}
		<div>
			<h4>Let's make some labels</h4>
			<ChooseFile on:file-selected={handleFileSelected} fileMIMETypes={['text/csv', 'application/vnd.ms-excel']}></ChooseFile>
		</div>
		{:else}
			
			<LabelLayout></LabelLayout>
		{/if}
	</Modal>
</main>

<style>
 main {
	 margin:1cm;
	 padding: 0px;
	 border-top: 1px solid rgb(168, 168, 168);
 }

</style>