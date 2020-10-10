<script lang="ts">
  import { onMount } from "svelte";
  import { getActivity } from "../services/getActivity";
  import { setup, setHeartRateData, renderRoute } from "../route";
  import { activity } from "../stores/activity";
  import { getZones } from "../services/getZones";

  let container: HTMLElement;
  onMount(() => {
    setup(container);
  });

  getZones().then((data) => setHeartRateData(data.heart_rate));

  activity.subscribe((value) => {
    if (!value) {
      return;
    }
    getActivity(value.id).then((data) => {
      if (!data.latlng || !data.heartrate) {
        alert("Missing GPS / Heart Rate data");
        return;
      }
      renderRoute(data);
    });
  });
</script>

<style>
  main {
    margin-top: 3rem;
    width: calc(100% - 20rem);
    height: calc(100% - 3rem);
  }
</style>

<main bind:this={container} />
