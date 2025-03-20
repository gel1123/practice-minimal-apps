/// <reference path="../../../sst-env.d.ts" />
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Entity } from 'electrodb';
import { Resource } from 'sst';
import { v7 } from 'uuid';

function datetimeSortableId() {
	return v7();
}

const client = new DynamoDB.DocumentClient();
const table = Resource.OrthoclaseTable.name;

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
			service: 'orthoclase'
		},
		attributes: {
			id: {
				type: 'string',
				required: true,
				readOnly: true,
				default: datetimeSortableId
			},
			title: {
				type: 'string',
				required: true
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
