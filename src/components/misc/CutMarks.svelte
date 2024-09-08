<script>
  export let char
</script>
<div>{Array(300).join(char)}</div>

<style>
  div {
    line-height: .5em;
    white-space: nowrap;
    overflow:hidden;
  }
</style>