import { TodoTitle } from "../L1.domain/TodoTitle";
import { MemoryTodoDataSource } from "../L4.infrastructure/MemoryTodoDataSource";
import { TodoUsecase } from "./TodoUsecase";
import { describe, it, expect, beforeEach } from "vitest";

describe("TodoUsecase", () => {
  let todoUsecase: TodoUsecase;
  let dataSource: MemoryTodoDataSource;

  beforeEach(() => {
    dataSource = new MemoryTodoDataSource();
    todoUsecase = new TodoUsecase(dataSource);
  });

  describe("add", () => {
    it("should add a new todo with the specified title", async () => {
      const title = TodoTitle.create("テストタスク");
      const todo = await todoUsecase.createTodo(title);

      expect(todo.title.getValue()).toBe("テストタスク");
      expect(todo.status.getValue()).toBe("NotStarted");

      const savedTodo = await dataSource.get(todo.id.getValue());
      expect(savedTodo).not.toBeNull();
      expect(savedTodo?.title.getValue()).toBe("テストタスク");
    });
  });

  describe("start", () => {
    it("should change the status of a todo to IN_PROGRESS", async () => {
      const title = TodoTitle.create("開始するタスク");
      const todo = await todoUsecase.createTodo(title);
      const startedTodo = await todoUsecase.startTodo(todo.id.getValue());

      expect(startedTodo.status.getValue()).toBe("InProgress");

      const savedTodo = await dataSource.get(todo.id.getValue());
      expect(savedTodo?.status.getValue()).toBe("InProgress");
    });

    it("should throw an error if todo not found", async () => {
      await expect(todoUsecase.startTodo("not-exist-id")).rejects.toThrow(
        "Todo not found",
      );
    });
  });

  describe("complete", () => {
    it("should change the status of a todo to DONE", async () => {
      const title = TodoTitle.create("完了するタスク");
      const todo = await todoUsecase.createTodo(title);
      const completedTodo = await todoUsecase.completeTodo(todo.id.getValue());

      expect(completedTodo.status.getValue()).toBe("Completed");

      const savedTodo = await dataSource.get(todo.id.getValue());
      expect(savedTodo?.status.getValue()).toBe("Completed");
    });

    it("should throw an error if todo not found", async () => {
      await expect(todoUsecase.completeTodo("not-exist-id")).rejects.toThrow(
        "Todo not found",
      );
    });
  });

  describe("reset", () => {
    it("should change the status of a todo back to TODO", async () => {
      const title = TodoTitle.create("リセットするタスク");
      const todo = await todoUsecase.createTodo(title);
      await todoUsecase.startTodo(todo.id.getValue());
      const resetTodo = await todoUsecase.resetTodo(todo.id.getValue());

      expect(resetTodo.status.getValue()).toBe("NotStarted");

      const savedTodo = await dataSource.get(todo.id.getValue());
      expect(savedTodo?.status.getValue()).toBe("NotStarted");
    });

    it("should throw an error if todo not found", async () => {
      await expect(todoUsecase.resetTodo("not-exist-id")).rejects.toThrow(
        "Todo not found",
      );
    });
  });

  describe("changeTitle", () => {
    it("should change the title of a todo", async () => {
      const title = TodoTitle.create("元のタイトル");
      const todo = await todoUsecase.createTodo(title);

      const newTitle = TodoTitle.create("新しいタイトル");
      const updatedTodo = await todoUsecase.changeTodoTitle(
        todo.id.getValue(),
        newTitle,
      );

      expect(updatedTodo.title.getValue()).toBe("新しいタイトル");

      const savedTodo = await dataSource.get(todo.id.getValue());
      expect(savedTodo?.title.getValue()).toBe("新しいタイトル");
    });

    it("should throw an error if todo not found", async () => {
      const newTitle = TodoTitle.create("新しいタイトル");
      await expect(
        todoUsecase.changeTodoTitle("not-exist-id", newTitle),
      ).rejects.toThrow("Todo not found");
    });
  });
});
