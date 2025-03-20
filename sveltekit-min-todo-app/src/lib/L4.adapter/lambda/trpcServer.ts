import {
	awsLambdaRequestHandler,
	type CreateAWSLambdaContextOptions
} from '@trpc/server/adapters/aws-lambda';
import { initTRPC } from '@trpc/server';
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

const t = initTRPC
	.context<CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>>()
	.create();

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
		})
});

export type Router = typeof router;

export const handler = awsLambdaRequestHandler({
	router: router,
	createContext: (opts) => opts
});
