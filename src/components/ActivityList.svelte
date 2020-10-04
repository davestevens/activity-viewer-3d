<script lang="ts">
  export let onSelect: (id: string) => void;
  import { getActivities } from "../services/getActivities";
  import ActivityOption from "./ActivityOption.svelte";

  const activitiesPromise = getActivities();
</script>

<ul class="nav">
  {#await activitiesPromise}
    <li class="nav-item">loading</li>
  {:then activities}
    {#each activities as activity}
      <ActivityOption {activity} {onSelect} />
    {/each}
  {:catch error}
    <li class="nav-item">ERROR: {error.message}</li>
  {/await}
</ul>
