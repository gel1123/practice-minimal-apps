import {
	awsLambdaRequestHandler,
	type CreateAWSLambdaContextOptions
} from '@trpc/server/adapters/aws-lambda';
import { initTRPC } from '@trpc/server';
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';
import { Todo, type TodoProps } from '$lib/entity/Todo';

const t = initTRPC
	.context<CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>>()
	.create();

const router = t.router({
	todo: {
		list: t.procedure.query(async () => {
			const {
				data
			}: {
				data: TodoProps[];
			} = await Todo.query.orderById({}).go({
				order: 'desc'
			});
			return data;
		}),

		new: t.procedure.input(z.object({ title: z.string() })).mutation(async ({ input }) => {
			const {
				data
			}: {
				data: TodoProps;
			} = await Todo.create({
				title: input.title
			}).go();
			return data;
		}),

		toggleStatus: t.procedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
			const {
				data: oldTodo
			}: {
				data: TodoProps | null;
			} = await Todo.get({
				id: input.id
			}).go();
			if (!oldTodo) {
				throw new Error('Not found');
			}
			const {
				data: newTodo
			}: {
				data: TodoProps;
			} = await Todo.put({
				id: input.id,
				title: oldTodo.title,
				completed: !oldTodo.completed
			}).go();
			return newTodo;
		}),

		changeTitle: t.procedure
			.input(z.object({ id: z.string(), title: z.string() }))
			.mutation(async ({ input }) => {
				const {
					data
				}: {
					data: TodoProps;
				} = await Todo.update({
					id: input.id
				})
					.set({
						title: input.title
					})
					.go({ response: 'all_new' });
				return data;
			}),

		delete: t.procedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
			const {
				data
			}: {
				data: TodoProps | null;
			} = await Todo.delete({
				id: input.id
			}).go({ response: 'all_old' });
			return data;
		})
	}
});

export type Router = typeof router;

export const handler = awsLambdaRequestHandler({
	router: router,
	createContext: (opts) => opts
});
