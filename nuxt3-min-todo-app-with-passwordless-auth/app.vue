<script setup lang="ts">
import { Todo } from "./lib/L1.domain/Todo";
import type { TodoApi } from "./server/api/[...]";
import { hc } from "hono/client";

const baseUrl = useRequestURL();
const client = hc<TodoApi>(baseUrl.origin);

const {
  data: todoItems,
  status,
  error,
  refresh,
} = useAsyncData(() => client.api.todo.list.$get().then((r) => r.json()));

const todoItemsNotStarted = computed(
  () => todoItems.value?.filter((todo) => todo.status === "NotStarted") ?? [],
);

const todoItemsInProgress = computed(
  () => todoItems.value?.filter((todo) => todo.status === "InProgress") ?? [],
);

const todoItemsCompleted = computed(
  () => todoItems.value?.filter((todo) => todo.status === "Completed") ?? [],
);

async function createTodo() {
  await client.api.todo.create.$post({ json: { title: "新しいやること" } });
  await refresh();
}

async function startTodo(id: string) {
  await client.api.todo.start.$post({ json: { id } });
  await refresh();
}

async function completeTodo(id: string) {
  await client.api.todo.complete.$post({ json: { id } });
  await refresh();
}

async function resetTodo(id: string) {
  await client.api.todo.reset.$post({ json: { id } });
  await refresh();
}

async function changeTodoTitle(id: string, title: string) {
  await client.api.todo["change-title"].$post({ json: { id, title } });
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center">
    <div v-if="status === 'pending'">loading...</div>
    <div v-else-if="status === 'error'">error: {{ error }}</div>
    <div v-else-if="status === 'success'">
      <h2 v-if="todoItemsInProgress.length" class="text-2xl font-bold">
        進行中
      </h2>
      <ul>
        <TodoItem
          v-for="todo in todoItemsInProgress"
          :key="todo.id"
          :todo="Todo.reconstruct(todo)"
          class="mb-4"
          @start-todo="startTodo"
          @complete-todo="completeTodo"
          @reset-todo="resetTodo"
          @change-todo-title="changeTodoTitle"
        />
      </ul>

      <h2 v-if="todoItemsNotStarted.length" class="text-2xl font-bold">
        未着手
      </h2>
      <ul>
        <TodoItem
          v-for="todo in todoItemsNotStarted"
          :key="todo.id"
          :todo="Todo.reconstruct(todo)"
          class="mb-4"
          @start-todo="startTodo"
          @complete-todo="completeTodo"
          @reset-todo="resetTodo"
          @change-todo-title="changeTodoTitle"
        />
      </ul>

      <div>
        <button
          class="mx-auto flex size-12 items-center justify-center rounded-full bg-gray-200 p-4"
          @click="createTodo"
        >
          +
        </button>
      </div>

      <h2 v-if="todoItemsCompleted.length" class="text-2xl font-bold">完了</h2>
      <ul>
        <TodoItem
          v-for="todo in todoItemsCompleted"
          :key="todo.id"
          :todo="Todo.reconstruct(todo)"
          class="mb-4"
          @start-todo="startTodo"
          @complete-todo="completeTodo"
          @reset-todo="resetTodo"
          @change-todo-title="changeTodoTitle"
        />
      </ul>
    </div>
  </div>
</template>
