<script lang="ts">
  import { getActivity, IActivity } from "../services/getActivity";
  import { renderRoute } from "../route";
  import { activity } from "../stores/activity";

  let activityPromise: Promise<IActivity>;
  activity.subscribe((value) => {
    if (!value) {
      return;
    }
    activityPromise = getActivity(value);
    activityPromise.then((data) => renderRoute(data));
  });
</script>

<style>
  main {
    margin-top: 3rem;
    width: calc(100% - 20rem);
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
