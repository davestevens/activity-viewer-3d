<script lang="ts">
  import { getActivity, IActivity } from "../services/getActivity";
  import { activity } from "../stores/activity";

  let activityPromise: Promise<IActivity>;
  activity.subscribe((value) => {
    activityPromise = getActivity(value);
  });
</script>

<style>
  main {
    padding-top: 48px;
  }
</style>

<main class="col-md-9 ml-sm-auto col-lg-10 px-4">
  <h2>Activity {$activity}</h2>

  {#await activityPromise}
    <div>Loading</div>
  {:then}
    <div>Loaded</div>
  {:catch error}
    <div>Error: {error.message}</div>
  {/await}
</main>
