<script lang="ts">
  import SidebarHeader from "../components/SidebarHeader.svelte";
  import ActivityList from "../components/ActivityList.svelte";
  import ZonesData from "../components/ZonesData.svelte";
</script>

<style>
  .sidebar {
    margin-top: 48px;
    width: 320px;
    height: calc(100vh - 48px);
  }

  .sidebar-sticky {
    overflow: auto;
    height: 100%;
  }
</style>

<nav class="sidebar">
  <div class="sidebar-sticky">
    <SidebarHeader title="Activities" />
    <ActivityList />

    <SidebarHeader title="Zones Data" />
    <!-- TODO: expandable -->
    <ZonesData />
  </div>
</nav>
