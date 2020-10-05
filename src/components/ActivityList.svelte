<script lang="ts">
  import { getActivities } from "../services/getActivities";
  import ActivityOption from "./ActivityOption.svelte";

  const activitiesPromise = getActivities();
</script>

<div class="list-group list-group-flush">
  {#await activitiesPromise}
    <div class="list-group-item text-center">
      <i class="fas fa-spinner fa-pulse" />
    </div>
  {:then activities}
    {#each activities as activity}
      <ActivityOption {activity} />
    {/each}
  {:catch error}
    <div class="list-group-item list-group-item-danger text-center">
      Something went wrong:
      {error.message}
    </div>
  {/await}
</div>
