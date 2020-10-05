<script lang="ts">
  import { activities } from "../stores/activities";

  let loading: boolean = false;

  const loadMore = () => {
    loading = true;
    activities.getNextPage().then(() => (loading = false));
  };
</script>

<div class="list-group-item text-center">
  <button
    type="button"
    class="btn btn-primary btn-block"
    disabled={loading}
    on:click={loadMore}>
    {#if loading}<i class="fas fa-spinner fa-pulse" />{:else}Load More{/if}
  </button>
</div>
