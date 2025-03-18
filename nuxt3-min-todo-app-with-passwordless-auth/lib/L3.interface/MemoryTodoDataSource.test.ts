import { Todo } from "../L1.domain/Todo";
import { TodoTitle } from "../L1.domain/TodoTitle";
import { MemoryDataSource } from "./MemoryTodoDataSource";
import { it, expect, describe, beforeEach } from "vitest";

describe("MemoryDataSource", () => {
  let dataSource: MemoryDataSource;
  let todo: Todo;

  beforeEach(() => {
    dataSource = new MemoryDataSource();
    todo = Todo.new(TodoTitle.create("テストタスク"));
  });

  describe("scan", () => {
    it("空のデータソースから空の配列を返すこと", async () => {
      const result = await dataSource.scan();
      expect(result).toEqual([]);
    });

    it("保存されているすべてのTodoを返すこと", async () => {
      const todo2 = Todo.new(TodoTitle.create("テストタスク2"));
      await dataSource.create(todo);
      await dataSource.create(todo2);

      const result = await dataSource.scan();
      expect(result).toHaveLength(2);
      expect(result.map((t) => t.title.getValue())).toContain("テストタスク");
      expect(result.map((t) => t.title.getValue())).toContain("テストタスク2");
    });
  });

  describe("get", () => {
    it("存在するIDのTodoを取得できること", async () => {
      await dataSource.create(todo);
      const result = await dataSource.get(todo.id.getValue());
      expect(result?.title.getValue()).toBe("テストタスク");
    });

    it("存在しないIDの場合nullを返すこと", async () => {
      const result = await dataSource.get("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("新しいTodoを作成できること", async () => {
      const result = await dataSource.create(todo);
      expect(result.title.getValue()).toBe("テストタスク");

      const stored = await dataSource.get(todo.id.getValue());
      expect(stored?.title.getValue()).toBe("テストタスク");
    });

    it("IDが設定されていない場合はエラーを投げること", async () => {
      const invalidTodo = Object.create(todo);
      invalidTodo.id = { getValue: () => "" };

      await expect(dataSource.create(invalidTodo)).rejects.toThrow(
        "Entity must have an id",
      );
    });
  });

  describe("put", () => {
    it("既存のTodoを更新できること", async () => {
      await dataSource.create(todo);
      const updatedTodo = todo.changeTitle(
        TodoTitle.create("更新されたタスク"),
      );

      const result = await dataSource.put(updatedTodo);
      expect(result?.title.getValue()).toBe("更新されたタスク");
    });

    it("存在しないTodoの場合nullを返すこと", async () => {
      const result = await dataSource.put(todo);
      expect(result).toBeNull();
    });

    it("IDが設定されていない場合はエラーを投げること", async () => {
      const invalidTodo = Object.create(todo);
      invalidTodo.id = { getValue: () => "" };

      await expect(dataSource.put(invalidTodo)).rejects.toThrow(
        "Entity must have an id",
      );
    });
  });

  describe("delete", () => {
    it("存在するTodoを削除できること", async () => {
      await dataSource.create(todo);
      const result = await dataSource.delete(todo.id.getValue());
      expect(result).toBe(true);

      const stored = await dataSource.get(todo.id.getValue());
      expect(stored).toBeNull();
    });

    it("存在しないTodoの削除の場合falseを返すこと", async () => {
      const result = await dataSource.delete("non-existent-id");
      expect(result).toBe(false);
    });
  });
});
