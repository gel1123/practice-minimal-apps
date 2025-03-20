import { Todo } from '$lib/L1.domain/Todo';
import type { TodoRepository } from '$lib/L1.domain/TodoRepository';

export class TodoUsecase {
	constructor(private todoRepository: TodoRepository) {}

	async add() {
		const todo = Todo.new('New todo');
		return await this.todoRepository.create(todo);
	}

	async list() {
		return await this.todoRepository.scan();
	}

	async complete(id: string) {
		const todo = await this.todoRepository.get(id);
		if (!todo) {
			throw new Error('Todo not found');
		}
		const completedTodo = Todo.reconstruct(todo.id, todo.title, true);
		return await this.todoRepository.put(completedTodo);
	}
}
