import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";

/**
 * ## NOTE
 * 別ファイルに切り出したHono Appと結合するには下記のように行う。
 *
 * ```ts
 * app.route("/", otherHonoApp);
 * ```
 */

const app = new Hono()
  .basePath("/api")
  .get("/hello", async (c) => {
    return c.json({ message: "Hello from Hono!" });
  })
  .get("/hello/:name", async (c) => {
    const name = c.req.param("name");
    return c.json({ message: "Hello, " + name });
  })
  .post(
    "/posts",
    validator("form", (value, c) => {
      const parsed = z
        .object({
          title: z.string(),
          body: z.string(),
          tags: z.array(z.string()),
        })
        .safeParse(value);
      if (!parsed.success) {
        return c.text("Invalid!", 401);
      }
      return parsed.data;
    }),
    (c) => {
      const params = c.req.valid("form");
      console.log(`Posted: ${JSON.stringify(params)}`);
      return c.json(
        {
          message: "Post created!",
        },
        201,
      );
    },
  )
  .patch(
    "/posts/:id",
    validator("param", (value, c) => {
      const parsed = z.object({ id: z.string() }).safeParse(value);
      if (!parsed.success) {
        return c.text("Invalid!", 401);
      }
      return parsed.data;
    }),
    validator("json", (value, c) => {
      const parsed = z
        .object({
          title: z.string(),
          body: z.string(),
          tags: z.array(z.string()),
        })
        .safeParse(value);
      if (!parsed.success) {
        return c.text("Invalid!", 401);
      }
      return parsed.data;
    }),
    (c) => {
      const params = c.req.valid("json");
      console.log(`Patched: ${JSON.stringify(params)}`);
      return c.json(
        {
          message: "Post updated!",
        },
        200,
      );
    },
  );

export type App = typeof app;

export default defineEventHandler(async (event) => {
  const req = toWebRequest(event);
  return app.fetch(req);
});
