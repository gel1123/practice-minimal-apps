<script lang="ts">
	import { trpcClient } from '$lib/adapter/trpcClient';
	import type { TodoProps } from '$lib/entity/Todo';

	const {
		todo,
		withRefetchListTodo
	}: {
		todo: TodoProps;
		withRefetchListTodo: (promise: Promise<unknown>) => void;
	} = $props();

	function handleOnChangeTitle(event: Event) {
		const target = event.target as HTMLInputElement;
		const title = target.value;
		trpcClient.todo.changeTitle.mutate({
			id: todo.id,
			title
		});
	}

	function handleOnClickToggleCompleted() {
		withRefetchListTodo(trpcClient.todo.toggleStatus.mutate({ id: todo.id }));
	}
</script>

<li
	class={[
		todo.completed ? 'bg-gray-300' : 'bg-amber-300',
		'flex items-center justify-between gap-4 rounded-sm p-4'
	]}
>
	<input class="border-none bg-white/50" value={todo.title} onchange={handleOnChangeTitle} />
	<button onclick={handleOnClickToggleCompleted}>
		{todo.completed ? 'リセット' : '終わった！'}
	</button>
</li>
