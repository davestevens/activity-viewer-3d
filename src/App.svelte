<script>
  import { Router, Route } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import Activities from "./pages/Activities.svelte";
  import Activity from "./pages/Activity.svelte";

  export let url = "";
</script>

<Router {url}>
  <div>
    <Route path="activities/:id" component={Activity} />
    <Route path="activities" component={Activities} />
    <Route path="/">
      <Home />
    </Route>
  </div>
</Router>
