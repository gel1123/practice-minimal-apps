import { TodoTitle } from "../L1.domain/TodoTitle";
import type { TodoUsecase } from "../L2.usecase/TodoUsecase";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";

export const createTodoApi = (usecase: TodoUsecase) => {
  return new Hono()
    .basePath("/api")
    .get("/todo/list", async (c) => {
      const todos = await usecase.listTodos();
      return c.json(todos.map((todo) => todo.toJSON()));
    })
    .post(
      "/todo/create",
      validator("json", (value, c) => {
        const parsed = z
          .object({ title: z.string().min(1).max(100) })
          .safeParse(value);
        if (!parsed.success) {
          return c.text("Invalid!", 401);
        }
        return parsed.data;
      }),
      async (c) => {
        const { title } = c.req.valid("json");
        const todo = await usecase.createTodo(TodoTitle.create(title));
        return c.json(todo.toJSON());
      },
    )
    .post(
      "/todo/start",
      validator("json", (value, c) => {
        const parsed = z.object({ id: z.string() }).safeParse(value);
        if (!parsed.success) {
          return c.text("Invalid!", 401);
        }
        return parsed.data;
      }),
      async (c) => {
        const { id } = c.req.valid("json");
        const todo = await usecase.startTodo(id);
        return c.json(todo.toJSON());
      },
    )
    .post(
      "/todo/complete",
      validator("json", (value, c) => {
        const parsed = z.object({ id: z.string() }).safeParse(value);
        if (!parsed.success) {
          return c.text("Invalid!", 401);
        }
        return parsed.data;
      }),
      async (c) => {
        const { id } = c.req.valid("json");
        const todo = await usecase.completeTodo(id);
        return c.json(todo.toJSON());
      },
    )
    .post(
      "/todo/reset",
      validator("json", (value, c) => {
        const parsed = z.object({ id: z.string() }).safeParse(value);
        if (!parsed.success) {
          return c.text("Invalid!", 401);
        }
        return parsed.data;
      }),
      async (c) => {
        const { id } = c.req.valid("json");
        const todo = await usecase.resetTodo(id);
        return c.json(todo.toJSON());
      },
    )
    .post(
      "/todo/change-title",
      validator("json", (value, c) => {
        const parsed = z
          .object({ id: z.string(), title: z.string().min(1).max(100) })
          .safeParse(value);
        if (!parsed.success) {
          return c.text("Invalid!", 401);
        }
        return parsed.data;
      }),
      async (c) => {
        const { id, title } = c.req.valid("json");
        const todo = await usecase.changeTodoTitle(id, TodoTitle.create(title));
        return c.json(todo.toJSON());
      },
    );
};
