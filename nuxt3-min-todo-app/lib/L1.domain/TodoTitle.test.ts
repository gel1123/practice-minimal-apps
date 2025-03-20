import { TodoTitle } from "./TodoTitle";
import { it, expect, describe } from "vitest";

describe("TodoTitle", () => {
  it("should create valid title", () => {
    const title = TodoTitle.create("テストタスク");
    expect(title.getValue()).toBe("テストタスク");
  });

  it("should compare titles correctly", () => {
    const title1 = TodoTitle.create("テストタスク");
    const title2 = TodoTitle.create("テストタスク");
    const title3 = TodoTitle.create("別のタスク");

    expect(title1.equals(title2)).toBe(true);
    expect(title1.equals(title3)).toBe(false);
    expect(title1.equals(null)).toBe(false);
    expect(title1.equals(undefined)).toBe(false);
  });

  it("should validate title length", () => {
    // Empty title
    expect(() => TodoTitle.create("")).toThrow(
      "TodoTitle length must be between 1 and 100 characters",
    );

    // Title with 100 characters should be valid
    const validLongTitle = "a".repeat(100);
    expect(() => TodoTitle.create(validLongTitle)).not.toThrow();

    // Title with 101 characters should throw error
    const invalidLongTitle = "a".repeat(101);
    expect(() => TodoTitle.create(invalidLongTitle)).toThrow(
      "TodoTitle length must be between 1 and 100 characters",
    );
  });
});
