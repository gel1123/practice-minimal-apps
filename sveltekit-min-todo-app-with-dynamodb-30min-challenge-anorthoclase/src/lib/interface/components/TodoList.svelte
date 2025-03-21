<script lang="ts">
	import type { TodoProps } from '$lib/domain/Todo';
	import TodoListItem from './TodoListItem.svelte';

	let {
		todoList,
		withRefetch
	}: {
		todoList: TodoProps[];
		withRefetch: (promise: Promise<unknown>) => void;
	} = $props();
</script>

<ul>
	{#each todoList as todo}
		<TodoListItem {todo} {withRefetch} />
	{/each}
</ul>
