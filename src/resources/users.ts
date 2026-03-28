import type { User, ListUsersParams } from '../types/user.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class UsersResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListUsersParams): Promise<SchoologyListResponse<User>> {
    return this.client.request<SchoologyListResponse<User>>({
      method: 'GET',
      path: '/users',
      params: params as Record<string, unknown>,
    });
  }

  async get(uid: number | string): Promise<User> {
    return this.client.request<User>({
      method: 'GET',
      path: `/users/${uid}`,
    });
  }

  async *listAll(params?: ListUsersParams): AsyncGenerator<User, void, undefined> {
    yield* this.client.listAll<User>('/users', params as Record<string, unknown>);
  }
}
