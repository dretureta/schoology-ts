import type { Section, ListSectionsParams, CreateSectionInput, UpdateSectionInput } from '../types/section.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class SectionsResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListSectionsParams): Promise<SchoologyListResponse<Section>> {
    return this.client.request<SchoologyListResponse<Section>>({
      method: 'GET',
      path: '/sections',
      params: params as Record<string, unknown>,
    });
  }

  async get(sid: number | string): Promise<Section> {
    return this.client.request<Section>({ method: 'GET', path: `/sections/${sid}` });
  }

  async create(data: CreateSectionInput): Promise<Section> {
    return this.client.request<Section>({ method: 'POST', path: '/sections', body: data });
  }

  async update(sid: number | string, data: UpdateSectionInput): Promise<Section> {
    return this.client.request<Section>({ method: 'PUT', path: `/sections/${sid}`, body: data });
  }

  async delete(sid: number | string): Promise<void> {
    await this.client.request({ method: 'DELETE', path: `/sections/${sid}` });
  }

  async *listAll(params?: ListSectionsParams): AsyncGenerator<Section, void, undefined> {
    yield* this.client.listAll<Section>('/sections', params as Record<string, unknown>);
  }
}
