<script>
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store';
	import Router from 'svelte-spa-router'
	import routes from '../lib/routes';

	let rawData = writable([])
	let settings = writable({})
	let fieldMappings = writable({})

	setContext('data', rawData)
	setContext('settings', settings)
	setContext('mappings', fieldMappings)

</script>

<div class="container">
	<Router {routes} />
</div>

<style>
 
	.container {
		margin:1cm;
		padding: 0px;
		border-top: 1px solid rgb(168, 168, 168);
	}

	@media print {    
		.container {
			margin-top:0;
		}
	}

</style>