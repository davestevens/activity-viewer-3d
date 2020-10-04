<script>
  import { auth } from "./stores/auth";
  import Header from "./components/Header.svelte";
  import Home from "./pages/Home.svelte";
  import Activities from "./pages/Activities.svelte";
</script>

<div class="container-fluid h-100 overflow-hidden">
  {#if $auth}
    <Header />
    <Activities />
  {:else}
    <Home />
  {/if}
</div>
