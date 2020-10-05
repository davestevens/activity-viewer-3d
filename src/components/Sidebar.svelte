<script lang="ts">
  import SidebarHeader from "../components/SidebarHeader.svelte";
  import ActivityList from "../components/ActivityList.svelte";
  import ZonesData from "../components/ZonesData.svelte";

  let collapsed: boolean = true;

  const toggleBottom = () => {
    collapsed = !collapsed;
  };
</script>

<style>
  .sidebar {
    margin-top: 48px;
    width: 320px;
    height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    border-right: 1px solid #00000020;
  }

  .sidebar-top {
    overflow: auto;
    flex-shrink: 1;
  }

  .sidebar-bottom__button {
    cursor: pointer;
  }

  .sidebar-bottom {
    overflow: auto;
    flex-shrink: 0;
  }

  .sidebar-bottom__collapsable.collapse {
    height: 0;
  }
</style>

<nav class="sidebar">
  <div class="sidebar-top">
    <SidebarHeader title="Activities" />
    <ActivityList />
  </div>

  <div class="sidebar-bottom">
    <div
      class="sidebar-bottom__button list-group-item d-flex justify-content-between align-items-center"
      on:click={toggleBottom}>
      Zones Data
      <i
        class="fas"
        class:fa-chevron-up={collapsed}
        class:fa-chevron-down={!collapsed} />
    </div>
    <div class="sidebar-bottom__collapsable" class:collapse={collapsed}>
      <ZonesData />
    </div>
  </div>
</nav>
