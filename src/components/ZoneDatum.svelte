<script lang="ts">
  export let label: string;
  export let min: string;
  export let max: string;
  export let color: string;
</script>

<style>
  .color-marker {
    display: inline-block;
    vertical-align: middle;
    width: 1.25rem;
    height: 1.25rem;
  }
</style>

<div>
  <span>{label} </span>
  <span class="color-marker" style={`background-color: ${color};`} />
  <span>{min} - {max}</span>
</div>
