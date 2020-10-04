<script lang="ts">
  import { getActivities } from "../services/getActivities";
  import { getZones } from "../services/getZones";

  const activitiesPromise = getActivities();
  const zonesPromise = getZones();
</script>

<main>
  <h2>Activities</h2>
  {#await activitiesPromise}
    <div>loading</div>
  {:then activities}
    <ul>
      {#each activities as activity}
        <li>{activity.name} : {activity.start_date}</li>
      {/each}
    </ul>
  {:catch error}
    <div>ERROR: {error.message}</div>
  {/await}

  {#await zonesPromise}
    <div>loading</div>
  {:then}
    <div>Zones data loaded</div>
  {:catch error}
    <div>ERROR: {error.message}</div>
  {/await}
</main>
