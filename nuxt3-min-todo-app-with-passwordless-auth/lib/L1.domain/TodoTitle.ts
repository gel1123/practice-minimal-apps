export class TodoTitle {
  private readonly value: string;

  private constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    if (value.length < 1 || value.length > 100) {
      throw new Error(
        `TodoTitle length must be between 1 and 100 characters: ${value}`,
      );
    }
  }

  public equals(other: TodoTitle | null | undefined): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public getValue(): string {
    return this.value;
  }

  public static create(value: string): TodoTitle {
    return new TodoTitle(value);
  }
}
