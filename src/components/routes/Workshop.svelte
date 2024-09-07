<script>
  import NumberInput from "../settings/NumberInput.svelte";
</script>

<NumberInput id='test' labelString='test input' min="5" max="10" value="7" on:value-change={ev => console.log(ev.detail)} />