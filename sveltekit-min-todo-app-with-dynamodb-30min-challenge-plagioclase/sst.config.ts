/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'plagioClase',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			protect: ['production'].includes(input?.stage),
			home: 'aws'
		};
	},
	async run() {
		const table = new sst.aws.Dynamo('PlagioClaseTable', {
			fields: {
				pk: 'string',
				sk: 'string',
				gsi1pk: 'string',
				gsi1sk: 'string',
				gsi2pk: 'string',
				gsi2sk: 'string',
				gsi3pk: 'string',
				gsi3sk: 'string'
			},
			ttl: 'expiry',
			primaryIndex: {
				hashKey: 'pk',
				rangeKey: 'sk'
			},
			globalIndexes: {
				gsi1: { hashKey: 'gsi1pk', rangeKey: 'gsi1sk', projection: 'all' },
				gsi2: { hashKey: 'gsi2pk', rangeKey: 'gsi2sk', projection: 'all' },
				gsi3: { hashKey: 'gsi3pk', rangeKey: 'gsi3sk', projection: 'all' }
			}
		});

		const trpc = new sst.aws.Function('PlagioClaseTrpc', {
			url: true,
			handler: 'src/lib/L4.adapter/lambda/trpcServer.handler',
			link: [table]
		});

		new sst.aws.SvelteKit('PlagioClaseWeb', {
			environment: {
				PUBLIC_TRPC_URL: trpc.url
			}
		});
	}
});
