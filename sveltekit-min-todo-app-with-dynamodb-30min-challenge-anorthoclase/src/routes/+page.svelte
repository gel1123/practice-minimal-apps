<script lang="ts">
	import { trpcClient } from '$lib/adapter/trpcClient';
	import TodoList from '$lib/interface/components/TodoList.svelte';

	let todoListPromise = trpcClient.todo.list.query();

	function withRefetch(promise: Promise<unknown>) {
		todoListPromise = promise.then(() => trpcClient.todo.list.query());
	}

	function handleOnClickAdd() {
		withRefetch(trpcClient.todo.new.mutate());
	}
</script>

{#await todoListPromise}
	<p>Loading...</p>
{:then todoList}
	<TodoList {todoList} {withRefetch} />
{:catch error}
	<p>Error: {error.message}</p>
{/await}

<div class="mx-auto">
	<button
		class="flex size-12 items-center justify-center rounded-full bg-amber-200 hover:bg-amber-300"
		onclick={handleOnClickAdd}>+</button
	>
</div>
