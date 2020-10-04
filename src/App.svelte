<script>
  import { auth } from "./stores/auth";
  import Home from "./pages/Home.svelte";
  import Activities from "./pages/Activities.svelte";
</script>

<main>
  {#if $auth}
    <Activities />
  {:else}
    <Home />
  {/if}
</main>
