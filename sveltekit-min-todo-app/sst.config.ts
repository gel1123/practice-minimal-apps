/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'albite',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws'
    };
  },
  async run() {
    const trpc = new sst.aws.Function('AlbiteTrpc', {
      url: true,
      handler: 'src/lib/L4.adapter/lambda/trpcServer.handler'
    });

    new sst.aws.SvelteKit('AlbiteWeb', {
      environment: {
        PUBLIC_TRPC_URL: trpc.url
      }
    });
  }
});
