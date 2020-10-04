<script lang="ts">
  import type { IZoneData } from "../services/getZones";
  export let zoneData: IZoneData;
  import ZoneDatum from "./ZoneDatum.svelte";
  import { HEART_RATE_ZONE_COLORS } from "../consts";
</script>

<div>
  <h6>Heart Rate</h6>
  <ZoneDatum
    label="1"
    color={HEART_RATE_ZONE_COLORS[0]}
    min={`${zoneData.zones[0].min}`}
    max={`${zoneData.zones[0].max}`} />
  <ZoneDatum
    label="2"
    color={HEART_RATE_ZONE_COLORS[1]}
    min={`${zoneData.zones[1].min}`}
    max={`${zoneData.zones[1].max}`} />
  <ZoneDatum
    label="3"
    color={HEART_RATE_ZONE_COLORS[2]}
    min={`${zoneData.zones[2].min}`}
    max={`${zoneData.zones[2].max}`} />
  <ZoneDatum
    label="4"
    color={HEART_RATE_ZONE_COLORS[3]}
    min={`${zoneData.zones[3].min}`}
    max={`${zoneData.zones[3].max}`} />
  <ZoneDatum
    label="5"
    color={HEART_RATE_ZONE_COLORS[4]}
    min={`${zoneData.zones[4].min}`}
    max="∞" />
</div>
