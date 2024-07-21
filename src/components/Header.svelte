<script>
  import { getContext } from 'svelte'
  import {link} from 'svelte-spa-router'
  import langs from '../i18n/lang'

  let langOptions = ['en', 'afr']

  const settings = getContext('settings')

  const handLangButtonClick = _ => {
		const langIndex = langOptions.indexOf($settings.lang)
		const nextIndex = langIndex + 1
		if (langOptions.length > nextIndex) {
			$settings.lang = langOptions[nextIndex]
		}
		else {
			$settings.lang = langOptions[0]
		}
	}

</script>
<div style="display:flex; width: 100%; justify-content:space-between">
  <h2>{langs[$settings.lang]['header']}</h2>
  <nav style="display: flex; gap:2em">
    <a href="/" use:link>home</a>
    <a href="/info" use:link>info</a>
    <button class="secondary-button" on:click={handLangButtonClick}>{$settings.lang}</button>
  </nav>
</div>

<style>

  .secondary-button {
    background-color: transparent; 
    border: 1px solid transparent; 
    color:grey;
  }

  .secondary-button:hover {
    border: 1px solid gray
  }

  nav {
    margin: 0
  }
</style>