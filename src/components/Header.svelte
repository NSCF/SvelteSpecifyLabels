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
<div style="positin:relative;display:flex; width: 100%; justify-content:space-between; border-bottom: 1px solid rgb(168, 168, 168);">
  
  <div >
    <a class="logo" style="display: flex;align-items:center" href="/" use:link><img src="/logo.png" width="50px" height="60px" alt=""><span style="color:#2e3238;font-size:3em; font-family:Cedarville Cursive, cursive; margin-left:.2em; margin-top:15px;">{langs['header'][$settings.lang]}</span></a>
  </div>
  <nav style="display: flex; gap:2em;margin-right:2em;">
    <a href="/info" use:link>{langs['info'][$settings.lang]}</a>
    <a href="https://nscf.org.za/learn-more-about-us" target="_blank">{langs['aboutNSCF'][$settings.lang]}</a>
    <a href="/" use:link>{langs['home'][$settings.lang]}</a>
    <!-- <button class="secondary-button" on:click={handLangButtonClick}>{$settings.lang}</button> -->
  </nav>
  <img style="position:absolute;right:-.5em;top:-.5em;height:1.5em;border:10px solid white;border-radius:50%;transform:rotate(45deg);" src="github-cat.svg" alt="github"/>
  <a title="view on github" class="gradient" style="position:absolute;right:-7em;width:250px;height:2em;transform:rotate(45deg);" href="https://github.com/NSCF/SvelteSpecifyLabels" target="_blank">
  </a>
</div>

<style>

  .logo {
    font-weight: normal;
  }

  .logo:hover {
    filter: none;
    text-decoration: none;
  }

  /* DONT DELETE THESE
  
   .secondary-button {
    background-color: transparent; 
    border: 1px solid transparent; 
    color:grey;
  }

  .secondary-button:hover {
    border: 1px solid gray
  } */

  nav {
    margin: 0
  }

  .gradient {
    background-image: linear-gradient(transparent, transparent, transparent, transparent, transparent, lightgray,black);
  }
</style>