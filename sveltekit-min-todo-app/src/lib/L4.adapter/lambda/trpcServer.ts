import {
  awsLambdaRequestHandler,
  type CreateAWSLambdaContextOptions
} from '@trpc/server/adapters/aws-lambda';
import { initTRPC } from '@trpc/server';
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';
import { TodoRepository } from '$lib/L1.domain/TodoRepository';
import { TodoUseCase } from '$lib/L2.usecase/TodoUseCase';
import { DynamoTodoDataSource } from '$lib/L3.infra/DynamoTodoDataSource';

const t = initTRPC
  .context<CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>>()
  .create();

const todoUseCase = new TodoUseCase(new TodoRepository(new DynamoTodoDataSource()));

const router = t.router({
  ping: t.procedure
    .input(
      z
        .object({
          number: z.number()
        })
        .optional()
    )
    .query(({ input }) => {
      const number = input?.number ?? 0;
      return 'pong' + '!'.repeat(number);
    }),

  todo: {
    list: t.procedure.query(async () => await todoUseCase.list()),

    add: t.procedure
      .input(z.object({ title: z.string().min(1).max(100) }))
      .mutation(async ({ input }) => await todoUseCase.new(input.title)),

    changeTitle: t.procedure
      .input(z.object({ id: z.string(), title: z.string().min(1).max(100) }))
      .mutation(async ({ input }) => await todoUseCase.changeTitle(input.id, input.title)),

    proceedNextStatus: t.procedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => await todoUseCase.proceedNextStatus(input.id)),

    remove: t.procedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => await todoUseCase.remove(input.id))
  }
});

export type Router = typeof router;

export const handler = awsLambdaRequestHandler({
  router: router,
  createContext: (opts) => opts
});
