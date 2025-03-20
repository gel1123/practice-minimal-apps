import type { Todo } from '$lib/L1.domain/Todo';
import type { ITodoDataSource } from '$lib/L1.domain/TodoRepository';

export class MemoryTodoDataSource implements ITodoDataSource {
  private data: Map<string, Todo> = new Map();

  async scan(): Promise<Todo[]> {
    return Array.from(this.data.values());
  }

  async get(id: string): Promise<Todo | null> {
    return this.data.get(id) || null;
  }

  async create(entity: Todo): Promise<Todo> {
    if (!entity.id) {
      throw new Error('Entity must have an id');
    }
    this.data.set(entity.id, entity);
    return entity;
  }

  async put(entity: Todo): Promise<Todo | null> {
    if (!entity.id) {
      throw new Error('Entity must have an id');
    }
    if (!this.data.has(entity.id)) {
      return null;
    }
    this.data.set(entity.id, entity);
    return entity;
  }

  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }
}
