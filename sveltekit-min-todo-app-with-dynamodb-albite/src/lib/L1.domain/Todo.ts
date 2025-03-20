import { v7 } from 'uuid';

export type TodoStatus = 'not-started' | 'in-progress' | 'done';

export type TodoProps = {
  id: string;
  title: string;
  status: TodoStatus;
};

export const isTodoStatus = (value: unknown): value is TodoStatus => {
  return ['not-started', 'in-progress', 'done'].includes(value as string);
};

export const isTodo = (value: {
  id: string;
  title: string;
  status: string;
}): value is TodoProps => {
  return isTodoStatus(value.status);
};

export class Todo {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly status: TodoStatus
  ) {}

  static reconstruct(id: string, title: string, status: TodoStatus): Todo {
    if (!isTodoStatus(status)) {
      throw new Error('Invalid status');
    }
    return new Todo(id, title, status);
  }

  static new(title: string): Todo {
    return new Todo(v7(), title, 'not-started');
  }

  static getNextStatus(status: TodoStatus): TodoStatus {
    switch (status) {
      case 'not-started':
        return 'in-progress';
      case 'in-progress':
        return 'done';
      case 'done':
      default:
        return 'not-started';
    }
  }
}
