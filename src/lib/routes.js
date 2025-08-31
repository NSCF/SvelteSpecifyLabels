import Home from '../components/routes/Home.svelte'
import Design from '../components/routes/Design.svelte'
import FieldMappings from '../components/routes/FieldMappings.svelte'
import Info from '../components/routes/Info.svelte'
import Workshop from '../components/routes/Workshop.svelte'
import Preview from '../components/routes/Preview.svelte'
import NameExamples from '../components/routes/NameExamples.svelte'

const routes = {

  "/": Home,

  "/design": Design,

  "/mappings": FieldMappings,

  "/info": Info,

  "/preview": Preview,

  "/workshop": Workshop,

  "/name_examples": NameExamples

}

export default routes
