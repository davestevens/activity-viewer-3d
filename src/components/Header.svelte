<script lang="ts">
  import { auth } from "../stores/auth";

  const displayName = `${$auth.athlete.firstname} ${$auth.athlete.lastname}`;
</script>

<style>
  .navbar-brand {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    font-size: 1rem;
  }

  .navbar-image {
    width: 1.875rem;
    height: 1.875rem;
  }
</style>

<nav
  class="navbar navbar-dark navbar-expand-lg fixed-top bg-dark flex-md-nowrap p-0 shadow">
  <span class="navbar-brand col-sm-3 col-md-2 mr-0">Activity Viewer 3D</span>
  <ul class="navbar-nav ml-auto px-3">
    <li class="nav-item">
      <span class="navbar-text">
        {displayName}
        <img
          class="rounded-circle navbar-image"
          src={$auth.athlete.profile_medium}
          alt="Profile" />
      </span>
    </li>
  </ul>
</nav>
