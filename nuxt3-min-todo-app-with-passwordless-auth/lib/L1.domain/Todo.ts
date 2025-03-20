import { TodoId } from "./TodoId";
import { TodoStatus } from "./TodoStatus";
import type { TodoTitle } from "./TodoTitle";

export class Todo {
  private constructor(
    public readonly id: TodoId,
    public readonly title: TodoTitle,
    public readonly status: TodoStatus,
  ) {}

  public static new(title: TodoTitle): Todo {
    return new Todo(
      TodoId.generateNew(),
      title,
      TodoStatus.create("NotStarted"),
    );
  }

  public changeTitle(title: TodoTitle): Todo {
    return new Todo(this.id, title, this.status);
  }

  public start(): Todo {
    return new Todo(this.id, this.title, TodoStatus.create("InProgress"));
  }

  public complete(): Todo {
    return new Todo(this.id, this.title, TodoStatus.create("Completed"));
  }

  public reset(): Todo {
    return new Todo(this.id, this.title, TodoStatus.create("NotStarted"));
  }

  public toJSON() {
    return {
      id: this.id.getValue(),
      title: this.title.getValue(),
      status: this.status.getValue(),
    };
  }
}
