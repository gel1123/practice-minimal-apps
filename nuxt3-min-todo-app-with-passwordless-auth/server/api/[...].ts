import { Hono } from "hono";
import { TodoUsecase } from "~/lib/L2.usecase/TodoUsecase";
import { createTodoApi } from "~/lib/L3.interface/TodoApi";
import { MemoryTodoDataSource } from "~/lib/L4.infrastructure/MemoryTodoDataSource";

const app = new Hono();

const todoApi = createTodoApi(new TodoUsecase(new MemoryTodoDataSource()));

app.route("/", todoApi);

export type TodoApi = typeof todoApi;

export default defineEventHandler(async (event) => {
  const req = toWebRequest(event);
  return app.fetch(req);
});
