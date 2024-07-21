<script>
  import { getContext } from 'svelte'
  import { push, link } from 'svelte-spa-router'
  import Header from '../Header.svelte';
  import ChooseFile from '../ChooseFile.svelte'
  import langs from '../../i18n/lang';
  import exampleData from '../../exampleData'
  import defaultSettings from '../../lib/settings'

  let title = "NSCF labels"
  let exampleDataURL = 'https://docs.google.com/spreadsheets/d/17GK3ET4YRysCzieaSZAwn4mOyt3dBvTwlocZSIVPFgc/edit?usp=sharing'

  const rawData = getContext('data')

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

  const settings = getContext('settings')	
  $settings = defaultSettingsCopy //so that we can reuse defaultSettings later

  const handleFileDataAndTitle = async ev => {
		let payload = ev.detail 
		$rawData = payload.data
		title = payload.title
    push('/design')
	}

	const addExampleLabels = _ => {
		$rawData = exampleData
		push('/design')
	}

</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<Header />
<div style="max-width:600px; margin:auto">
  <ChooseFile on:data={handleFileDataAndTitle} />
  <div style="width:100%; display: flex; justify-content:flex-end; gap:2em;">
    <a href={exampleDataURL} target="_blank">{langs[$settings.lang]['exampleData']}</a>
    <a href="/design" use:link  on:click|preventDefault={addExampleLabels}>{langs[$settings.lang]['exampleLabels']}</a>
  </div>
</div>