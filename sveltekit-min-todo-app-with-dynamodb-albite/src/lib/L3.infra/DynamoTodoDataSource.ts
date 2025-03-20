/// <reference path="../../../sst-env.d.ts" />

import { isTodo, type Todo } from '$lib/L1.domain/Todo';
import type { ITodoDataSource } from '$lib/L1.domain/TodoRepository';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Entity } from 'electrodb';
import { Resource } from 'sst';

export class DynamoTodoDataSource implements ITodoDataSource {
  private todoResource = setupTodoResource();

  async scan(): Promise<Todo[]> {
    const todoResources = await this.todoResource.query.orderById({}).go({ order: 'desc' });
    return todoResources.data.filter((todo): todo is Todo => isTodo(todo));
  }

  async get(id: string): Promise<Todo | null> {
    const { data } = await this.todoResource.get({ id }).go();
    if (!data) {
      return null;
    }
    if (!isTodo(data)) {
      throw new Error('Invalid todo data');
    }
    return data;
  }

  async create(entity: Todo): Promise<Todo> {
    if (!entity.id) {
      throw new Error('Entity must have an id');
    }
    await this.todoResource.create(entity).go();
    return entity;
  }

  async put(entity: Todo): Promise<Todo | null> {
    if (!entity.id) {
      throw new Error('Entity must have an id');
    }
    await this.todoResource.put(entity).go();
    return entity;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.todoResource.delete({ id }).go({
      response: 'all_old'
    });
    return !!result.data;
  }
}

function setupTodoResource() {
  const client = new DynamoDB.DocumentClient();
  const table = Resource.AlbiteTable.name;

  return new Entity(
    {
      model: {
        entity: 'todo',
        version: '1',
        service: 'albite'
      },
      attributes: {
        id: {
          type: 'string',
          required: true,
          readOnly: true
        },
        status: {
          type: 'string',
          required: true
        },
        title: {
          type: 'string',
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
