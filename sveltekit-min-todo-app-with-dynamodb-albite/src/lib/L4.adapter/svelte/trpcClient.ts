import { env } from '$env/dynamic/public';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { Router } from '$lib/L4.adapter/lambda/trpcServer';

export const trpcClient = createTRPCClient<Router>({
  links: [
    httpBatchLink({
      url: env.PUBLIC_TRPC_URL!
    })
  ]
});
