<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="prose container mx-auto flex flex-col items-center py-4">
  {@render children()}
</div>
