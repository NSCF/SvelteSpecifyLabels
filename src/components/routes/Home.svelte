<script>
  import { getContext } from 'svelte'
  import { push, link } from 'svelte-spa-router'
  import Header from '../Header.svelte';
  import ChooseFile from '../ChooseFile.svelte'
  import langs from '../../i18n/lang';

  let title = "NSCF labels"

  const rawData = getContext('data')
  const settings = getContext('settings')	


  const handleFileDataAndTitle = async ev => {
		let payload = ev.detail 
		$rawData = payload.data
		title = payload.title
    push('/design')
	}


</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<Header />
<div style="max-width:1200px; margin:auto">
  <ChooseFile on:data={handleFileDataAndTitle} />
  <div style="width:100%; display: flex; justify-content:center; gap:2em;">
    <a href="/design" use:link  on:click|preventDefault={_ => push('/design')}>{langs['exampleLabels'][$settings.lang]}</a>
  </div>
</div>