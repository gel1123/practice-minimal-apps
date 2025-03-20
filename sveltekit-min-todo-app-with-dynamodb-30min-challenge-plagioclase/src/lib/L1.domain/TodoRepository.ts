import type { Todo } from './Todo';

export interface ITodoDataSource {
	scan(): Promise<Todo[]>;
	get(id: string): Promise<Todo | null>;
	create(data: Todo): Promise<Todo>;
	put(data: Todo): Promise<Todo>;
	delete(id: string): Promise<boolean>;
}

export class TodoRepository {
	constructor(private dataSource: ITodoDataSource) {}

	async scan(): Promise<Todo[]> {
		return this.dataSource.scan();
	}

	async get(id: string): Promise<Todo | null> {
		return this.dataSource.get(id);
	}

	async create(entity: Todo): Promise<Todo> {
		return this.dataSource.create(entity);
	}

	async put(entity: Todo): Promise<Todo> {
		return this.dataSource.put(entity);
	}

	async delete(id: string): Promise<boolean> {
		return this.dataSource.delete(id);
	}
}
