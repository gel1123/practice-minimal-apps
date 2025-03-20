import { Todo } from '$lib/L1.domain/Todo';
import type { TodoRepository } from '$lib/L1.domain/TodoRepository';

export class TodoUseCase {
  constructor(private repository: TodoRepository) {}

  async list(): Promise<Todo[]> {
    return await this.repository.scan();
  }

  async new(title: string): Promise<Todo> {
    return await this.repository.create(Todo.new(title));
  }

  async changeTitle(id: string, title: string): Promise<Todo | null> {
    const todo = await this.repository.get(id);
    if (!todo) {
      return null;
    }
    return await this.repository.put(Todo.reconstruct(todo.id, title, todo.status));
  }

  async proceedNextStatus(id: string): Promise<Todo | null> {
    const todo = await this.repository.get(id);
    if (!todo) {
      return null;
    }
    const nextStatus = Todo.getNextStatus(todo.status);
    return await this.repository.put(Todo.reconstruct(todo.id, todo.title, nextStatus));
  }

  async remove(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
