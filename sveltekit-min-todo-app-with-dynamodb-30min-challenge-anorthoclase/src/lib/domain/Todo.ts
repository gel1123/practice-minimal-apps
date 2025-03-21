/// <reference path="../../../sst-env.d.ts" />
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Entity } from 'electrodb';
import { Resource } from 'sst';
import { v7 } from 'uuid';

const client = new DynamoDB.DocumentClient();
const table = Resource.AnorthoclaseTable.name;

export type TodoProps = {
	id: string;
	title: string;
	completed: boolean;
};

export const Todo = new Entity(
	{
		model: {
			entity: 'todo',
			version: '1',
			service: 'store'
		},
		attributes: {
			id: {
				type: 'string',
				required: true,
				readOnly: true,
				default: v7
			},
			title: {
				type: 'string',
				required: true,
				default: 'new todo'
			},
			completed: {
				type: 'boolean',
				required: true,
				default: false
			}
		},
		indexes: {
			orderById: {
				pk: {
					field: 'pk',
					composite: []
				},
				sk: {
					field: 'sk',
					composite: ['id']
				}
			}
		}
	},
	{ client, table }
);
