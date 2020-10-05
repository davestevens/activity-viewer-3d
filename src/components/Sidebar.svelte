<script lang="ts">
  import SidebarHeader from "../components/SidebarHeader.svelte";
  import ActivityList from "../components/ActivityList.svelte";
  import ZonesData from "../components/ZonesData.svelte";
</script>

<style>
  .sidebar {
    padding: 48px 0 0;
  }

  .sidebar-sticky {
    overflow: auto;
    height: calc(100vh - 48px);
  }
</style>

<nav class="col-md-2 d-none d-md-block bg-light sidebar">
  <div class="sidebar-sticky">
    <SidebarHeader title="Activities" />
    <ActivityList />

    <SidebarHeader title="Zones Data" />
    <!-- TODO: expandable -->
    <ZonesData />
  </div>
</nav>
