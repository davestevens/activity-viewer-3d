<script lang="ts">
  export let onSelect: (id: string) => void;
  import type { IActivity } from "../services/getActivities";
  export let activity: IActivity;

  const isSelectable = activity.has_heartrate && !!activity.start_latlng;
</script>

<style>
  .isSelectable {
    cursor: pointer;
  }
</style>

<li
  class="nav-item"
  class:isSelectable
  class:text-muted={!isSelectable}
  on:click={() => isSelectable && onSelect(activity.id)}>
  <span class="navbar-text"> {activity.name} : {activity.start_date} </span>
</li>
