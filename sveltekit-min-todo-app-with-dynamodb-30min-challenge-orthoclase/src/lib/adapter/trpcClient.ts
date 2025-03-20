import { env } from '$env/dynamic/public';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { Router } from './trpcServer';

export const trpcClient = createTRPCClient<Router>({
	links: [
		httpBatchLink({
			url: env.PUBLIC_TRPC_URL!
		})
	]
});
