import { Todo } from "./Todo";
import { TodoTitle } from "./TodoTitle";
import { it, expect, describe } from "vitest";

describe("Todo", () => {
  it("should be created with NotStarted status", () => {
    const todo = Todo.new(TodoTitle.create("テストを実装する"));
    expect(todo.status.getValue()).toBe("NotStarted");
  });

  it("should be changed title", () => {
    const todo = Todo.new(TodoTitle.create("テストを実装する"));
    const changedTodo = todo.changeTitle(
      TodoTitle.create("起票済みのTODOのタイトルを変更する"),
    );
    expect(changedTodo.title.getValue()).toBe(
      "起票済みのTODOのタイトルを変更する",
    );
  });

  it("should be started", () => {
    const todo = Todo.new(TodoTitle.create("テストを実装する"));
    const startedTodo = todo.start();
    expect(startedTodo.status.getValue()).toBe("InProgress");
  });

  it("should be completed", () => {
    const todo = Todo.new(TodoTitle.create("テストを実装する"));
    const completedTodo = todo.complete();
    expect(completedTodo.status.getValue()).toBe("Completed");
  });

  it("should be reset", () => {
    const todo = Todo.new(TodoTitle.create("テストを実装する"));
    const completedTodo = todo.complete();
    const resetTodo = completedTodo.reset();
    expect(resetTodo.status.getValue()).toBe("NotStarted");
  });
});
