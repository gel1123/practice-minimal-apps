export class TodoId {
  private readonly value: string;

  private constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    if (!value || value.trim() === "") {
      throw new Error("IDは空にできません");
    }
  }

  public equals(other: TodoId | null | undefined): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public getValue(): string {
    return this.value;
  }

  public static create(value: string): TodoId {
    return new TodoId(value);
  }

  public static generateNew(): TodoId {
    return TodoId.create(crypto.randomUUID());
  }
}
