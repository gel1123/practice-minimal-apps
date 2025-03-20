<script lang="ts">
	import { trpcClient } from '$lib/adapter/trpcClient';
	import TodoItem from '$lib/components/TodoItem.svelte';

	let listTodoPromise = trpcClient.todo.list.query();

	function withRefetchListTodo(promise: Promise<unknown>) {
		listTodoPromise = promise.then(() => {
			return trpcClient.todo.list.query();
		});
	}

	function handleOnClickAddButton() {
		withRefetchListTodo(
			trpcClient.todo.new.mutate({
				title: 'New Todo'
			})
		);
	}
</script>

<div class="container flex flex-col items-center gap-8 py-8">
	{#await listTodoPromise}
		<p>Loading...</p>
	{:then listTodo}
		<button
			onclick={handleOnClickAddButton}
			class="flex size-12 items-center justify-center rounded-full bg-amber-300 hover:bg-amber-400"
		>
			+
		</button>
		<ul class="flex flex-col gap-4">
			{#each listTodo as todo}
				<TodoItem {todo} {withRefetchListTodo} />
			{/each}
		</ul>
	{:catch error}
		<p class="font-bold text-red-400">{error.message}</p>
	{/await}
</div>
