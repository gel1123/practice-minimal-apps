import { it, expect, describe } from "vitest";
import { TodoStatus } from "./TodoStatus";

describe("TodoStatus", () => {
  it("should create valid status", () => {
    const notStarted = TodoStatus.create("NotStarted");
    const inProgress = TodoStatus.create("InProgress");
    const completed = TodoStatus.create("Completed");

    expect(notStarted.getValue()).toBe("NotStarted");
    expect(inProgress.getValue()).toBe("InProgress");
    expect(completed.getValue()).toBe("Completed");
  });

  it("should compare status correctly", () => {
    const status1 = TodoStatus.create("NotStarted");
    const status2 = TodoStatus.create("NotStarted");
    const status3 = TodoStatus.create("InProgress");

    expect(status1.equals(status2)).toBe(true);
    expect(status1.equals(status3)).toBe(false);
  });

  it("should convert to string correctly", () => {
    const notStarted = TodoStatus.create("NotStarted");
    const inProgress = TodoStatus.create("InProgress");
    const completed = TodoStatus.create("Completed");

    expect(notStarted.toString()).toBe("NotStarted");
    expect(inProgress.toString()).toBe("InProgress");
    expect(completed.toString()).toBe("Completed");
  });
});