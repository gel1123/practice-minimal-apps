<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="prose container mx-auto flex min-h-screen flex-col gap-8 py-4">
	{@render children()}
</div>
