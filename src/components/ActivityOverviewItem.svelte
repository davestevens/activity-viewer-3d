<script lang="ts">
  export let icon: string;
  export let value: string;
  export let unit: string;
</script>

<style>
  .value {
    font-weight: 700;
  }
  .unit {
    font-size: 0.7rem;
  }
</style>

<div class="d-flex align-items-center justify-content-between">
  <i class={icon} />
  <span class="value px-1">{value}</span>
  <span class="unit">{unit}</span>
</div>
