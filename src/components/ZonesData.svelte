<script lang="ts">
  import { getZones } from "../services/getZones";

  const zonesPromise = getZones();
</script>

<ul class="nav">
  {#await zonesPromise}
    <li class="nav-item">loading</li>
  {:then}
    <li class="nav-item">Zones data loaded</li>
  {:catch error}
    <li class="nav-item">ERROR: {error.message}</li>
  {/await}
</ul>
