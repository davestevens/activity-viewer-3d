<script lang="ts">
  export let label: string;
  export let min: string;
  export let max: string;
  export let color: string;
</script>

<div class="list-group-item">
  <div class="d-flex w-100 justify-content-between align-items-center">
    <h4 class="mb-0">{label}</h4>
    <span>{min} - {max}</span>
    <span
      class="badge"
      style={`background-color: ${color};`}>&nbsp;&nbsp;&nbsp;</span>
  </div>
</div>
