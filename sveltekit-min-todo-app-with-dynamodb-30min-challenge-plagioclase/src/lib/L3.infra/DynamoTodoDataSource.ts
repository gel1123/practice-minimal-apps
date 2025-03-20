/// <reference path="../../../sst-env.d.ts" />
import type { Todo } from '$lib/L1.domain/Todo';
import type { ITodoDataSource } from '$lib/L1.domain/TodoRepository';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Entity } from 'electrodb';
import { Resource } from 'sst';

function createTodoSchema() {
	const client = new DynamoDB.DocumentClient();
	const table = Resource.PlagioClaseTable.name;

	return new Entity(
		{
			model: {
				entity: 'todo',
				version: '1',
				service: 'plagioClase'
			},
			attributes: {
				id: {
					type: 'string',
					required: true,
					readOnly: true
				},
				title: {
					type: 'string',
					required: true
				},
				completed: {
					type: 'boolean',
					required: true
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
}

export class DynamoTodoDataSource implements ITodoDataSource {
	private readonly todoSchema = createTodoSchema();

	async scan(): Promise<Todo[]> {
		const { data } = await this.todoSchema.query.orderById({}).go({ order: 'desc' });
		return data;
	}

	async get(id: string): Promise<Todo | null> {
		const { data } = await this.todoSchema.get({ id }).go();
		return data;
	}

	async create(entity: Todo): Promise<Todo> {
		const { data } = await this.todoSchema.create(entity).go();
		return data;
	}

	async put(entity: Todo): Promise<Todo> {
		const { data } = await this.todoSchema.put(entity).go();
		return data;
	}

	async delete(id: string): Promise<boolean> {
		const { data } = await this.todoSchema.delete({ id }).go();
		return !!data;
	}
}
