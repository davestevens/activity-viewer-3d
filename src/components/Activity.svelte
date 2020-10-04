<script lang="ts">
  export let id: string;
  import { afterUpdate } from "svelte";
  import { getActivity, IActivity } from "../services/getActivity";

  let activityPromise: Promise<IActivity>;
  afterUpdate(() => {
    activityPromise = getActivity(id);
  });
</script>

<style>
  main {
    padding-top: 48px;
  }
</style>

<main class="col-md-9 ml-sm-auto col-lg-10 px-4">
  <h2>Activity {id}</h2>

  {#await activityPromise}
    <div>Loading</div>
  {:then}
    <div>Loaded</div>
  {:catch error}
    <div>Error: {error.message}</div>
  {/await}
</main>
