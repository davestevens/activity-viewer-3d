<script lang="ts">
  import { onMount } from "svelte";
  import { setup, setHeartRateData, renderRoute } from "../route";
  import activity from "../example-data/activity.json";
  import zones from "../example-data/zones.json";

  let container: HTMLElement;
  onMount(() => {
    setup(container);
  });

  setHeartRateData(zones.heart_rate);
  renderRoute(activity);
</script>

<style>
  main {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<main bind:this={container} />
