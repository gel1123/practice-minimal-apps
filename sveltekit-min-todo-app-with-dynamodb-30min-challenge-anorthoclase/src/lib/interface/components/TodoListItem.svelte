<script lang="ts">
	import { trpcClient } from '$lib/adapter/trpcClient';
	import type { TodoProps } from '$lib/domain/Todo';

	let {
		todo,
		withRefetch
	}: {
		todo: TodoProps;
		withRefetch: (promise: Promise<unknown>) => void;
	} = $props();

	function handleOnClickDone() {
		withRefetch(trpcClient.todo.complete.mutate({ id: todo.id }));
	}

	function handleOnClickDelete() {
		withRefetch(trpcClient.todo.delete.mutate({ id: todo.id }));
	}

	function handleOnChangeTitle(event: Event) {
		const title = (event.target as HTMLInputElement).value;
		trpcClient.todo.changeTitle.mutate({ id: todo.id, title });
	}
</script>

<li
	class={[
		todo.completed ? 'bg-gray-100' : 'bg-amber-300',
		'flex items-center justify-between rounded-lg p-4'
	]}
>
	<div class="flex w-full items-center justify-between gap-4">
		{#if !todo.completed}
			<input
				class="w-full border-none bg-white/80"
				value={todo.title}
				onchange={handleOnChangeTitle}
			/>
			<button class="rounded-sm bg-white/50 p-2 hover:bg-white/80" onclick={handleOnClickDone}
				>done!</button
			>
		{:else}
			<span>{todo.title}</span>
			<button
				class="flex size-8 items-center justify-center rounded-full bg-gray-300 p-2 hover:bg-gray-400"
				onclick={handleOnClickDelete}>-</button
			>
		{/if}
	</div>
</li>
