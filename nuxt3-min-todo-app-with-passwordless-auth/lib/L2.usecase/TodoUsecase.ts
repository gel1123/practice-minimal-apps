import { Todo } from "../L1.domain/Todo";
import type { ITodoDataSource } from "../L1.domain/TodoRepository";
import type { TodoTitle } from "../L1.domain/TodoTitle";

export class TodoUsecase {
  constructor(private readonly todoDataSource: ITodoDataSource) {}

  async createTodo(title: TodoTitle): Promise<Todo> {
    const todo = Todo.new(title);
    await this.todoDataSource.create(todo);
    return todo;
  }

  async startTodo(id: string): Promise<Todo> {
    const todo = await this.todoDataSource.get(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    const newTodo = todo.start();
    await this.todoDataSource.put(newTodo);
    return newTodo;
  }

  async completeTodo(id: string): Promise<Todo> {
    const todo = await this.todoDataSource.get(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    const newTodo = todo.complete();
    await this.todoDataSource.put(newTodo);
    return newTodo;
  }

  async resetTodo(id: string): Promise<Todo> {
    const todo = await this.todoDataSource.get(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    const newTodo = todo.reset();
    await this.todoDataSource.put(newTodo);
    return newTodo;
  }

  async changeTodoTitle(id: string, title: TodoTitle): Promise<Todo> {
    const todo = await this.todoDataSource.get(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    const newTodo = todo.changeTitle(title);
    await this.todoDataSource.put(newTodo);
    return newTodo;
  }
}
