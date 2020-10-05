<script lang="ts">
  import { getActivity, IActivity } from "../services/getActivity";
  import { activity } from "../stores/activity";

  let activityPromise: Promise<IActivity>;
  activity.subscribe((value) => {
    if (value) {
      activityPromise = getActivity(value);
    }
  });
</script>

<style>
  main {
    margin-top: 48px;
    width: calc(100% - 320px);
  }
</style>

<main>
  <h2>Activity {$activity}</h2>

  {#await activityPromise}
    <div>Loading</div>
  {:then}
    <div>Loaded</div>
  {:catch error}
    <div>Error: {error.message}</div>
  {/await}
</main>
