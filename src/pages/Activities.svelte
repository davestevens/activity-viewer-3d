<script lang="ts">
  import Sidebar from "../components/Sidebar.svelte";
  import Activity from "../components/Activity.svelte";

  let selectedId: string;

  const onSelect = (id: string): void => {
    selectedId = id;
  };
</script>

<main class="row">
  <Sidebar {onSelect} />
  {#if selectedId}
    <Activity id={selectedId} />
  {/if}
</main>
