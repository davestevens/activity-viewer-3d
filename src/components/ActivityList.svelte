<script lang="ts">
  import { activities } from "../stores/activities";
  import ActivityOption from "./ActivityOption.svelte";
  import ActivityListNextPage from "./ActivityListNextPage.svelte";

  const activitiesPromise = activities.getNextPage();
</script>

<div class="list-group list-group-flush">
  {#await activitiesPromise}
    <div class="list-group-item text-center">
      <i class="fas fa-spinner fa-pulse" />
    </div>
  {:then}
    {#each $activities as activity}
      <ActivityOption {activity} />
    {/each}
    <ActivityListNextPage />
  {:catch error}
    <div class="list-group-item list-group-item-danger text-center">
      Something went wrong:
      {error.message}
    </div>
  {/await}
</div>
