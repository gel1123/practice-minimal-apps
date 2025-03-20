<script setup lang="ts">
import type { Todo } from "~/lib/L1.domain/Todo";

defineProps<{
  todo: Todo;
}>();

defineEmits<{
  startTodo: [todoId: string];
  completeTodo: [todoId: string];
  resetTodo: [todoId: string];
  changeTodoTitle: [todoId: string, title: string];
}>();
</script>

<template>
  <li
    :class="[
      todo.status.getValue() === 'InProgress' && 'bg-yellow-100',
      todo.status.getValue() === 'Completed' && 'bg-green-100',
      todo.status.getValue() === 'NotStarted' && 'bg-gray-100',
    ]"
    class="min-w-80 p-4"
  >
    <div class="flex items-center justify-center gap-2">
      <input
        :value="todo.title.getValue()"
        class="rounded border-none bg-white/50 p-2"
        @change="
          $emit('changeTodoTitle', todo.id.getValue(), $event.target.value)
        "
      />
      <span class="rounded bg-gray-500/50 p-2 font-bold">
        <button
          v-if="todo.status.getValue() === 'NotStarted'"
          @click="$emit('startTodo', todo.id.getValue())"
        >
          start
        </button>
        <button
          v-else-if="todo.status.getValue() === 'InProgress'"
          @click="$emit('completeTodo', todo.id.getValue())"
        >
          complete
        </button>
        <button v-else @click="$emit('resetTodo', todo.id.getValue())">
          reset
        </button>
      </span>
    </div>
  </li>
</template>
