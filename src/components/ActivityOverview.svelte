<script lang="ts">
  import { activity } from "../stores/activity";
  import ActivityOverviewItem from "./ActivityOverviewItem.svelte";

  interface IOverview {
    icon: string;
    value: string;
    unit: string;
  }

  let overviews: IOverview[] = [];

  activity.subscribe((value) => {
    if (!value) {
      return;
    }
    overviews = [
      {
        icon: "fas fa-ruler",
        value: ($activity.distance / 1000).toFixed(2),
        unit: "km",
      },
      {
        icon: "fas fa-clock",
        value: new Date($activity.moving_time * 1000)
          .toISOString()
          .substr(11, 8),
        unit: "",
      },
      {
        icon: "fas fa-stopwatch",
        value: (
          $activity.moving_time /
          60 /
          ($activity.distance / 1000)
        ).toFixed(2),
        unit: "min/km",
      },
      {
        icon: "fas fa-tachometer-alt",
        value: ($activity.average_speed * 3.6).toFixed(2),
        unit: "kph",
      },
      {
        icon: "fas fa-heart",
        value: value.average_heartrate.toFixed(0),
        unit: "bpm",
      },
      {
        icon: "fas fa-mountain",
        value: $activity.total_elevation_gain.toFixed(0),
        unit: "meters",
      },
    ];
  });
</script>

<style>
  div {
    position: absolute;
    bottom: 0;
    right: 0;
    width: calc(100% - 20rem);
    height: 3rem;
    background: #fff;
  }
</style>

<div class="p-1 d-flex justify-content-around">
  {#each overviews as overview}
    <ActivityOverviewItem {...overview} />
  {/each}
</div>
