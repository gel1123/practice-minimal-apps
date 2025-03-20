import {
	awsLambdaRequestHandler,
	type CreateAWSLambdaContextOptions
} from '@trpc/server/adapters/aws-lambda';
import { initTRPC } from '@trpc/server';
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';
import { TodoUsecase } from '$lib/L2.usecase/TodoUsecase';
import { TodoRepository } from '$lib/L1.domain/TodoRepository';
import { DynamoTodoDataSource } from '$lib/L3.infra/DynamoTodoDataSource';

const t = initTRPC
	.context<CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>>()
	.create();

const todoUsecase = new TodoUsecase(new TodoRepository(new DynamoTodoDataSource()));

const router = t.router({
	todo: {
		add: t.procedure.mutation(async () => {
			return await todoUsecase.add();
		}),
		list: t.procedure.query(async () => {
			return await todoUsecase.list();
		}),
		complete: t.procedure
			.input(
				z.object({
					id: z.string()
				})
			)
			.mutation(async ({ input }) => {
				return await todoUsecase.complete(input.id);
			})
	}
});

export type Router = typeof router;

export const handler = awsLambdaRequestHandler({
	router: router,
	createContext: (opts) => opts
});
