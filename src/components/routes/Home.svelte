<script>
  import { getContext } from 'svelte'
  import { push, link } from 'svelte-spa-router'
  import Header from '../Header.svelte';
  import ChooseFile from '../ChooseFile.svelte'
  import langs from '../../i18n/lang';
  import exampleData from '../../exampleData'

  let title = "NSCF labels"
  let exampleDataURL = 'https://docs.google.com/spreadsheets/d/17GK3ET4YRysCzieaSZAwn4mOyt3dBvTwlocZSIVPFgc/edit?usp=sharing'

  const rawData = getContext('data')
  const settings = getContext('settings')	


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
<div style="max-width:1200px; margin:auto">
  <ChooseFile on:data={handleFileDataAndTitle} />
  <div style="width:100%; display: flex; justify-content:flex-end; gap:2em;">
    <a href={exampleDataURL} target="_blank">{langs['exampleData'][$settings.lang]}</a>
    <a href="/design" use:link  on:click|preventDefault={addExampleLabels}>{langs['exampleLabels'][$settings.lang]}</a>
  </div>
</div>