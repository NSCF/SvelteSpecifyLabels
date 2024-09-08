<script>
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store';
	import Router from 'svelte-spa-router'
	import routes from '../lib/routes';
	import reconcileStoredSettings from '../lib/reconcileStoredSettings'

	import defaultAppSettings from '../settings/appSettings'
	import defaultGeneralLabelSettings from '../settings/generalLabelSettings'
	import defaultHerbariumLabelSettings from '../settings/herbariumLabelSettings'

	// we need this for legacy purposes, because the structure of settings changed...
	if (localStorage.getItem("labelSettings") != null) {
		// so we can handle evolution of settings...
		const savedSettings = JSON.parse(localStorage.getItem("labelSettings"))
		for (const [key, val] of Object.entries(savedSettings)) {
			if (key in defaultAppSettings) {
				defaultAppSettings[key] = val
			}
			if (key in defaultGeneralLabelSettings) {
				defaultGeneralLabelSettings[key] = val
			}
			//but not herbariumLabelSettings, as we've changed those field names...
		}
		localStorage.removeItem('labelSettings')
		localStorage.setItem('appSettings', JSON.stringify(defaultAppSettings))
		localStorage.setItem('generalLabelSettings', JSON.stringify(defaultGeneralLabelSettings))
	}

	//now we do the same for the new settings
	reconcileStoredSettings('appSettings', defaultAppSettings)
	reconcileStoredSettings('generalLabelSettings', defaultGeneralLabelSettings)
	reconcileStoredSettings('herbariumLabelSettings', defaultHerbariumLabelSettings)

	const appSettings = writable(defaultAppSettings)
	const generalLabelSettings = writable(defaultGeneralLabelSettings)
	const herbariumLabelSettings = writable(defaultHerbariumLabelSettings) 

	let rawData = writable([])
	let fieldMappings = writable({})
	let labelData = writable([])

	setContext('data', rawData)
	setContext('appSettings', appSettings)
	setContext('generalLabelSettings', generalLabelSettings)
	setContext('herbariumLabelSettings', herbariumLabelSettings)
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