<script lang="ts">
  export let onSelect: (id: string) => void;
  import type { IActivity } from "../services/getActivities";
  export let activity: IActivity;
</script>

<li class="nav-item" on:click={() => onSelect(activity.id)}>
  <span class="navbar-text"> {activity.name} : {activity.start_date} </span>
</li>
