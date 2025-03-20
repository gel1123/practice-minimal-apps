type _Value = "NotStarted" | "InProgress" | "Completed";

export class TodoStatus {
  private readonly value: _Value;

  private constructor(value: _Value | string) {
    this.validate(value);
    this.value = value as _Value;
  }

  private validate(value: _Value | string): void {
    if (["NotStarted", "InProgress", "Completed"].includes(value)) {
      return;
    }
    throw new Error(`Invalid TodoStatus value: ${this.toString()}`);
  }

  public equals(other: TodoStatus): boolean {
    return this.value === other.value;
  }

  public getValue(): _Value {
    return this.value;
  }

  public static create(value: string): TodoStatus {
    return new TodoStatus(value);
  }

  public toString(): string {
    return `${this.value}`;
  }
}
