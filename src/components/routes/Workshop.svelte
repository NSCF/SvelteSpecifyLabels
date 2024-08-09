<script>
  import SettingsIndividual from '../SettingsIndividual.svelte'
  import HerbariumLabel from "../labels/HerbariumLabel.svelte";
  import exampleData from "../../exampleDataPlants";
  import getFieldMappings from "../../lib/getFieldMappings";
  import mapRecord from "../../lib/mapRecord";


  // add some extra fields to exampledata
  const fieldMappings = getFieldMappings(exampleData[0])
  const mappedData = exampleData.map(x => mapRecord(x, fieldMappings))

  let recordIndex = 0

  const nextRecord = _ => {
    if (recordIndex < mappedData.length - 1){
      recordIndex++
    }
  }

  const previousRecord = _ => {
    if (recordIndex > 0){
      recordIndex--
    }
  }

</script>
<SettingsIndividual />
<div id="label" style="color: black;">
  <HerbariumLabel labelRecord={mappedData[recordIndex]}/>
  <div style="display: flex; align-items:center; gap:1em">
    <button style="padding: 4px; background-color:transparent;border:none; " on:click={previousRecord}><svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 -960 960 960" fill="#5f6368"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg></button>
    <span>{recordIndex + 1}</span>
    <button style="padding: 4px; background-color:transparent;border:none; " on:click={nextRecord}><svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 -960 960 960" fill="#5f6368"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg></button>
  </div>
</div>
