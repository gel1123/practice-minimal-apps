<script lang="ts">
  import { type TodoProps } from '$lib/L1.domain/Todo';
  import { trpcClient } from '../trpcClient';

  let {
    withRefetch,
    todo
  }: {
    withRefetch(promise: Promise<unknown>): void;
    todo: TodoProps;
  } = $props();

  let isTodoNotStarted = $derived(todo.status === 'not-started');
  let isTodoInProgress = $derived(todo.status === 'in-progress');
  let isTodoDone = $derived(todo.status === 'done');

  let nextButtonLabel = $derived.by(() => {
    if (isTodoNotStarted) return 'start';
    if (isTodoInProgress) return 'done';
    if (isTodoDone) return 'reset';
  });

  function proceedNextStatus() {
    withRefetch(trpcClient.todo.proceedNextStatus.mutate({ id: todo.id }));
  }

  function changeTitle(event: Event) {
    const newTitle = (event.target as HTMLInputElement).value;
    trpcClient.todo.changeTitle.mutate({ id: todo.id, title: newTitle });
  }

  function removeTodo() {
    withRefetch(trpcClient.todo.remove.mutate({ id: todo.id }));
  }
</script>

<div class="flex items-center justify-between gap-4">
  <div
    class={[
      isTodoNotStarted && 'bg-red-100',
      isTodoInProgress && 'bg-yellow-100',
      isTodoDone && 'bg-green-100',
      'flex min-w-80 items-center justify-between rounded-lg p-4'
    ]}
  >
    <input value={todo.title} class="border-none bg-white/50" onchange={changeTitle} />
    <button class="cursor-pointer" onclick={proceedNextStatus}>{nextButtonLabel}</button>
  </div>

  <div class="flex items-center justify-center">
    <button
      class="flex size-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 p-4 hover:bg-gray-200"
      onclick={removeTodo}
    >
      -
    </button>
  </div>
</div>
