import { it, expect, describe } from "vitest";
import { TodoId } from "./TodoId";

describe("TodoId", () => {
  it("should generate new unique id", () => {
    const id1 = TodoId.generateNew();
    const id2 = TodoId.generateNew();
    
    expect(id1.getValue()).not.toBe(id2.getValue());
    expect(id1.getValue()).toBeTruthy();
    expect(id2.getValue()).toBeTruthy();
  });

  it("should compare ids correctly", () => {
    const id1 = TodoId.generateNew();
    const id2 = TodoId.generateNew();
    const id3 = TodoId.generateNew();

    // Different IDs should not be equal
    expect(id1.equals(id2)).toBe(false);
    expect(id2.equals(id3)).toBe(false);

    // Same reference should be equal to itself
    expect(id1.equals(id1)).toBe(true);

    // null or undefined should not be equal
    expect(id1.equals(null)).toBe(false);
    expect(id1.equals(undefined)).toBe(false);
  });
});