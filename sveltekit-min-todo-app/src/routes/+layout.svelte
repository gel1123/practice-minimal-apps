<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="prose container mx-auto py-4">
  {@render children()}
</div>
