<script>
  import { getContext } from 'svelte'
  import { push, link } from 'svelte-spa-router'
  import Header from '../misc/Header.svelte';
  import ChooseFile from '../ChooseFile.svelte'
  import langs from '../../i18n/lang';

  let title = "NSCF labels"

  const rawData = getContext('data')
  const appSettings = getContext('appSettings')	

  $rawData = [] //in case we return to this page and want to add new data

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
  <div style="margin:auto;margin-top:50px;">
    <div style="display:flex;width:700px;justify-content:space-around;margin:auto;margin-top:20px; ">
      <div>
        <input type="radio" id="wetlabel" name="label-type" value="general" bind:group={$appSettings.labelType} >
        <label for="wetlabel">{langs['wet'][$appSettings.lang]}</label><br>
      </div>
      <div>
        <input type="radio" id="herbariumlabel" name="label-type" value="herbarium" bind:group={$appSettings.labelType} >
        <label for="herbariumlabel">{langs['herbarium'][$appSettings.lang]}</label><br>
      </div>
      <div>
        <input type="radio" id="insectlabel" name="label-type" value="insect" bind:group={$appSettings.labelType} disabled >
        <label for="insectlabel">{langs['insect'][$appSettings.lang]} ({langs['coming'][$appSettings.lang]})</label>
      </div>
    </div>
    <ChooseFile on:data={handleFileDataAndTitle} />
    <div style="width:100%; display: flex; justify-content:flex-end; gap:2em;">
      <a href="/design" use:link  on:click|preventDefault={_ => push('/design')}>{langs['exampleLabels'][$appSettings.lang]}</a>
    </div>
  </div>
</div>