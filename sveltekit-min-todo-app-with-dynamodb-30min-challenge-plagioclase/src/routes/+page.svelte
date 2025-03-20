<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { Router } from '$lib/L4.adapter/lambda/trpcServer';
	import { createTRPCClient, httpBatchLink } from '@trpc/client';

	export const trpcClient = createTRPCClient<Router>({
		links: [
			httpBatchLink({
				url: env.PUBLIC_TRPC_URL!
			})
		]
	});

	let promise = trpcClient.todo.list.query();

	function handleOnClickDone(id: string) {
		promise = trpcClient.todo.complete.mutate({ id }).then(() => {
			return trpcClient.todo.list.query();
		});
	}

	function handleOnClickAddTodo() {
		promise = trpcClient.todo.add.mutate().then(() => {
			return trpcClient.todo.list.query();
		});
	}
</script>

{#await promise}
	<p>loading...</p>
{:then value}
	<ul>
		{#each value as todo}
			<li class={[todo.completed ? 'bg-blue-200' : 'bg-red-200']}>{todo.title}</li>
			<button onclick={() => handleOnClickDone(todo.id)}>done</button>
		{/each}
	</ul>
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}

<button onclick={handleOnClickAddTodo}>add todo</button>
