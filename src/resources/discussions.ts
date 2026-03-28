import type { Discussion, ListDiscussionsParams, CreateDiscussionInput, UpdateDiscussionInput } from '../types/discussion.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class DiscussionsResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListDiscussionsParams): Promise<SchoologyListResponse<Discussion>> {
    return this.client.request<SchoologyListResponse<Discussion>>({
      method: 'GET',
      path: '/discussions',
      params: params as Record<string, unknown>,
    });
  }

  async get(did: number | string): Promise<Discussion> {
    return this.client.request<Discussion>({ method: 'GET', path: `/discussions/${did}` });
  }

  async create(sectionId: number | string, data: CreateDiscussionInput): Promise<Discussion> {
    return this.client.request<Discussion>({ method: 'POST', path: `/sections/${sectionId}/discussions`, body: data });
  }

  async update(did: number | string, data: UpdateDiscussionInput): Promise<Discussion> {
    return this.client.request<Discussion>({ method: 'PUT', path: `/discussions/${did}`, body: data });
  }

  async delete(did: number | string): Promise<void> {
    await this.client.request({ method: 'DELETE', path: `/discussions/${did}` });
  }

  async *listAll(params?: ListDiscussionsParams): AsyncGenerator<Discussion, void, undefined> {
    yield* this.client.listAll<Discussion>('/discussions', params as Record<string, unknown>);
  }
}
