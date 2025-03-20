<script lang="ts">
  import type { TodoProps } from '$lib/L1.domain/Todo';
  import { trpcClient } from '../trpcClient';
  import TodoListItem from './TodoListItem.svelte';

  async function fetchTodoList() {
    const todoList = await trpcClient.todo.list.query();
    return {
      notStarted: todoList.filter((todo) => todo.status === 'not-started'),
      inProgress: todoList.filter((todo_1) => todo_1.status === 'in-progress'),
      done: todoList.filter((todo_2) => todo_2.status === 'done')
    };
  }

  let todoListsPromise: Promise<{
    notStarted: TodoProps[];
    inProgress: TodoProps[];
    done: TodoProps[];
  }> = $state(fetchTodoList());

  function withRefetch(promise: Promise<unknown>) {
    todoListsPromise = promise.then(() => fetchTodoList());
  }

  function addTodo() {
    withRefetch(trpcClient.todo.add.mutate({ title: 'New todo' }));
  }
</script>

{#await todoListsPromise}
  <p>loading...</p>
{:then value}
  <div>
    {#if value.inProgress.length}
      <h2>進行中</h2>
    {/if}
    <ul class="flex flex-col gap-4">
      {#each value.inProgress as todo}
        <TodoListItem {todo} {withRefetch} />
      {/each}
    </ul>

    {#if value.notStarted.length}
      <h2>未着手</h2>
    {/if}
    <ul class="flex flex-col gap-4">
      {#each value.notStarted as todo}
        <TodoListItem {todo} {withRefetch} />
      {/each}
    </ul>

    <div class="flex items-center justify-center">
      <button
        class="flex size-12 cursor-pointer items-center justify-center rounded-full bg-red-100 p-4 hover:bg-red-200"
        onclick={addTodo}
      >
        +
      </button>
    </div>

    {#if value.done.length}
      <h2>完了済み</h2>
    {/if}
    <ul class="flex flex-col gap-4">
      {#each value.done as todo}
        <TodoListItem {todo} {withRefetch} />
      {/each}
    </ul>
  </div>
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}
