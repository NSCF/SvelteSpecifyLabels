<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher()

  export let id // so we can distinguish them
  export let labelString
  export let min
  export let max
  export let step = 1
  export let value
  export let unit = null

  let timer

  const handleKeyboardInput = _ => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      console.log(value)
      if(value) {
        if (Number(value) > Number(max) ) {
          value = max
        }
        if (Number(value) < Number(min) ) {
          value = min
        }
        dispatch('value-change', Number(value))
      }
		}, 350);
	}

  const handleMouseWheel = ev => {
    if (document.activeElement === ev.target) {
      ev.preventDefault()
      const field = ev.target.name
      let currentValue = value
      if (ev.deltaY < 0) {
        if (currentValue + step <= max) {
          value = currentValue + step
        }
      }
      if (ev.deltaY > 0) {
        if (currentValue - step >= min) {
          value = currentValue - step
        }
      }

      dispatch('value-change', Number(value))

    }
  }
</script>

<label for={id}>{labelString}</label>
<div style="display: flex;">
  <input type="number" name={id}
    min={min}
    max={max}
    step={step}
    on:keyup={handleKeyboardInput} 
    on:wheel={handleMouseWheel} bind:value={value}
    on:change={_ => dispatch('value-change', Number(value))} />
  {#if unit} 
  <span style="margin-left: 5px;">{unit}</span>
  {/if}
</div>