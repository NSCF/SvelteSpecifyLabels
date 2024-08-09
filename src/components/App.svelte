<script>
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store';
	import Router from 'svelte-spa-router'
	import routes from '../lib/routes';
  import defaultSettings from '../lib/settings'


	const defaultSettingsCopy = {} //because it changes
	for (const [key, val] of Object.entries(defaultSettings)){
		defaultSettingsCopy[key] = val
	}

	if (localStorage.getItem("labelSettings") != null) {
		// so we can handle evolution of settings...
		const savedSettings = JSON.parse(localStorage.getItem("labelSettings"))
		for (const [key, val] of Object.entries(savedSettings)) {
			if (key in defaultSettings) {
				defaultSettingsCopy[key] = val
			}
		}
	}

	let settings = writable(defaultSettingsCopy)

	let rawData = writable([])
	let fieldMappings = writable({})
	let labelData = writable([])

	setContext('data', rawData)
	setContext('settings', settings)
	setContext('mappings', fieldMappings)
	setContext('labelData', labelData)

</script>

<div class="container">
	<Router {routes} />
</div>

<style>
 
	.container {
		margin: 0 2em 2em;
		padding: 0px;
	}

	@media print {    
		.container {
			margin-top:0;
		}
	}

</style>