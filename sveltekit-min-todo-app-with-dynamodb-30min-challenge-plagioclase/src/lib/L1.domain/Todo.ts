import { v7 } from 'uuid';

export class Todo {
	private constructor(
		public readonly id: string,
		public readonly title: string,
		public readonly completed: boolean
	) {}

	public static new(title: string): Todo {
		const sortableUUID = v7();
		return new Todo(sortableUUID, title, false);
	}

	public static reconstruct(id: string, title: string, completed: boolean): Todo {
		return new Todo(id, title, completed);
	}
}
