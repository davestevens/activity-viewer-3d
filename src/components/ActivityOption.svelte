<script lang="ts">
  import type { IActivity } from "../services/getActivities";
  export let activity: IActivity;
  import { activity as activityStore } from "../stores/activity";

  const dateString = new Date(activity.start_date).toLocaleString();
  const isSelectable = activity.has_heartrate && !!activity.start_latlng;

  const onSelect = (): void => {
    if (!isSelectable) {
      return;
    }
    activityStore.selectActivity(activity);
  };
</script>

<style>
  .list-group-item-action {
    cursor: pointer;
  }

  .muted {
    color: #ddd;
  }

  .select-arrow {
    font-size: 2.5em;
  }
</style>

<div
  class="list-group-item"
  class:list-group-item-primary={$activityStore.id === activity.id}
  class:list-group-item-action={isSelectable}
  class:text-muted={!isSelectable}
  on:click={onSelect}
  title={isSelectable ? '' : 'Missing GPS / Heart Rate data'}>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <h5 class="mb-1">{activity.name}</h5>
      <small>{dateString}</small>
    </div>
    <div class="d-flex justify-content-between">
      <div class="d-flex flex-column justify-content-around align-items-center">
        <i
          class="fas fa-heart"
          class:muted={!activity.has_heartrate}
          title={activity.has_heartrate ? '' : 'Missing Heart Rate data'} />
        <i
          class="fas fa-map-marker-alt"
          class:muted={!activity.start_latlng}
          title={activity.start_latlng ? '' : 'Missing GPS data'} />
      </div>
      <div
        class="fas fa-chevron-right select-arrow d-flex align-items-center pl-2"
        class:muted={!isSelectable} />
    </div>
  </div>
</div>
