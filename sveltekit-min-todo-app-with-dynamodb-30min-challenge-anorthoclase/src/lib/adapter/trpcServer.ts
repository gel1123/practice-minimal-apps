import {
	awsLambdaRequestHandler,
	type CreateAWSLambdaContextOptions
} from '@trpc/server/adapters/aws-lambda';
import { initTRPC } from '@trpc/server';
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';
import { Todo } from '$lib/domain/Todo';

const t = initTRPC
	.context<CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>>()
	.create();

const router = t.router({
	todo: {
		list: t.procedure.query(async () => {
			const { data: todos } = await Todo.query.orderById({}).go({ order: 'desc' });
			return todos;
		}),
		new: t.procedure.mutation(async () => {
			await Todo.create({}).go();
			return;
		}),
		changeTitle: t.procedure
			.input(
				z.object({
					id: z.string(),
					title: z.string()
				})
			)
			.mutation(async ({ input }) => {
				await Todo.update({ id: input.id }).set({ title: input.title }).go();
				return;
			}),
		complete: t.procedure
			.input(
				z.object({
					id: z.string()
				})
			)
			.mutation(async ({ input }) => {
				await Todo.update({ id: input.id }).set({ completed: true }).go();
				return;
			}),
		delete: t.procedure
			.input(
				z.object({
					id: z.string()
				})
			)
			.mutation(async ({ input }) => {
				await Todo.delete({ id: input.id }).go();
				return;
			})
	},
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
		})
});

export type Router = typeof router;

export const handler = awsLambdaRequestHandler({
	router: router,
	createContext: (opts) => opts
});
