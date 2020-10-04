<script lang="ts">
  import { getZones } from "../services/getZones";
  import ZonesHeartRate from "./ZonesHeartRate.svelte";

  const zonesPromise = getZones();
</script>

<ul class="nav">
  {#await zonesPromise}
    <li class="nav-item">loading</li>
  {:then zones}
    <ZonesHeartRate zoneData={zones.heart_rate} />
  {:catch error}
    <li class="nav-item">ERROR: {error.message}</li>
  {/await}
</ul>
