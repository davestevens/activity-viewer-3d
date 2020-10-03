<script lang="ts">
  export let id: string;
  import { getActivity } from "../services/getActivity";

  const activityPromise = getActivity(id);
</script>

<main>
  <h2>Activity {id}</h2>

  {#await activityPromise}
    <div>Loading</div>
  {:then}
    <div>Loaded</div>
  {:catch error}
    <div>Error: {error.message}</div>
  {/await}
</main>
