import { Todo } from "../L1.domain/Todo";
import { TodoTitle } from "../L1.domain/TodoTitle";
import { TodoUsecase } from "../L2.usecase/TodoUsecase";
import { MemoryTodoDataSource } from "../L4.infrastructure/MemoryTodoDataSource";
import { createTodoApi } from "./TodoApi";
import { describe, expect, it } from "vitest";

describe("TodoApi", () => {
  describe("createTodo", () => {
    it("should create a new todo", async () => {
      const todoApi = createTodoApi(
        new TodoUsecase(new MemoryTodoDataSource()),
      );
      const response = await todoApi.request("/api/todo/create", {
        method: "POST",
        body: JSON.stringify({ title: "テストタスク" }),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(200);
      const todo = await response.json();
      expect(todo.title).toBe("テストタスク");
      expect(todo.status).toBe("NotStarted");
    });

    it("should return 401 if title is not provided", async () => {
      const todoApi = createTodoApi(
        new TodoUsecase(new MemoryTodoDataSource()),
      );
      const response = await todoApi.request("/api/todo/create", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(401);
    });

    it("should return 401 if title over 100 characters", async () => {
      const todoApi = createTodoApi(
        new TodoUsecase(new MemoryTodoDataSource()),
      );
      const response = await todoApi.request("/api/todo/create", {
        method: "POST",
        body: JSON.stringify({ title: "a".repeat(101) }),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(401);
    });
  });

  describe("startTodo", () => {
    it("should start a todo", async () => {
      const dataSource = new MemoryTodoDataSource();
      const todo = await dataSource.create(
        Todo.new(TodoTitle.create("開始するタスク")),
      );
      const todoApi = createTodoApi(new TodoUsecase(dataSource));
      const response = await todoApi.request("/api/todo/start", {
        method: "POST",
        body: JSON.stringify({ id: todo.id.getValue() }),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(200);
      const startedTodo = await response.json();
      expect(startedTodo.status).toBe("InProgress");
    });

    it("should return 401 if id is not provided", async () => {
      const todoApi = createTodoApi(
        new TodoUsecase(new MemoryTodoDataSource()),
      );
      const response = await todoApi.request("/api/todo/start", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(401);
    });
  });

  describe("completeTodo", () => {
    it("should complete a todo", async () => {
      const dataSource = new MemoryTodoDataSource();
      const todo = await dataSource.create(
        Todo.new(TodoTitle.create("完了するタスク")),
      );
      const todoApi = createTodoApi(new TodoUsecase(dataSource));
      const response = await todoApi.request("/api/todo/complete", {
        method: "POST",
        body: JSON.stringify({ id: todo.id.getValue() }),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(200);
      const completedTodo = await response.json();
      expect(completedTodo.status).toBe("Completed");
    });

    it("should return 401 if id is not provided", async () => {
      const todoApi = createTodoApi(
        new TodoUsecase(new MemoryTodoDataSource()),
      );
      const response = await todoApi.request("/api/todo/complete", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(401);
    });
  });

  describe("resetTodo", () => {
    it("should reset a todo", async () => {
      const dataSource = new MemoryTodoDataSource();
      const todo = await dataSource.create(
        Todo.new(TodoTitle.create("リセットするタスク")),
      );
      const todoApi = createTodoApi(new TodoUsecase(dataSource));
      const response = await todoApi.request("/api/todo/reset", {
        method: "POST",
        body: JSON.stringify({ id: todo.id.getValue() }),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(200);
      const resetTodo = await response.json();
      expect(resetTodo.status).toBe("NotStarted");
    });

    it("should return 401 if id is not provided", async () => {
      const todoApi = createTodoApi(
        new TodoUsecase(new MemoryTodoDataSource()),
      );
      const response = await todoApi.request("/api/todo/reset", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(401);
    });
  });

  describe("changeTitle", () => {
    it("should change the title of a todo", async () => {
      const dataSource = new MemoryTodoDataSource();
      const todo = await dataSource.create(
        Todo.new(TodoTitle.create("元のタイトル")),
      );
      const todoApi = createTodoApi(new TodoUsecase(dataSource));
      const response = await todoApi.request("/api/todo/change-title", {
        method: "POST",
        body: JSON.stringify({
          id: todo.id.getValue(),
          title: "新しいタイトル",
        }),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(200);
      const changedTodo = await response.json();
      expect(changedTodo.title).toBe("新しいタイトル");
    });

    it("should return 401 if id is not provided", async () => {
      const todoApi = createTodoApi(
        new TodoUsecase(new MemoryTodoDataSource()),
      );
      const response = await todoApi.request("/api/todo/change-title", {
        method: "POST",
        body: JSON.stringify({ title: "新しいタイトル" }),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(401);
    });

    it("should return 401 if title is not provided", async () => {
      const todoApi = createTodoApi(
        new TodoUsecase(new MemoryTodoDataSource()),
      );
      const response = await todoApi.request("/api/todo/change-title", {
        method: "POST",
        body: JSON.stringify({ id: "id" }),
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).toBe(401);
    });
  });
});
