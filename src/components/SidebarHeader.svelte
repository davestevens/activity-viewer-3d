<script lang="ts">
  export let title: string;
  export let subheading: boolean = false;
</script>

<style>
  .sidebar-heading {
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  .subheading {
    font-size: 0.75rem;
  }
</style>

<h6
  class="sidebar-heading px-3 mt-4 mb-1 text-muted"
  class:subheading
  class:mt-4={!subheading}
  class:mt-2={subheading}>
  {title}
</h6>
