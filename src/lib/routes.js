
import Home from '../routes/Home.svelte'
import NotFound from '../routes/NotFound.svelte';

const routes = {
  '/': Home,
  '*' : NotFound
}
  
export default routes