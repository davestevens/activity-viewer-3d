<script lang="ts">
  import { getZones } from "../services/getZones";
  import ZonesHeartRate from "./ZonesHeartRate.svelte";

  const zonesPromise = getZones();
</script>

<div class="list-group list-group-flush">
  {#await zonesPromise}
    <div class="list-group-item text-center">
      <i class="fas fa-spinner fa-pulse" />
    </div>
  {:then zones}
    <ZonesHeartRate zoneData={zones.heart_rate} />
  {:catch error}
    <div class="list-group-item list-group-item-danger text-center">
      Something went wrong:
      {error.message}
    </div>
  {/await}
</div>
