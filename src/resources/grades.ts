import type { Grade, ListGradesParams, CreateGradeInput, UpdateGradeInput } from '../types/grade.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class GradesResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListGradesParams): Promise<SchoologyListResponse<Grade>> {
    return this.client.request<SchoologyListResponse<Grade>>({
      method: 'GET',
      path: '/grades',
      params: params as Record<string, unknown>,
    });
  }

  async get(gid: number | string): Promise<Grade> {
    return this.client.request<Grade>({ method: 'GET', path: `/grades/${gid}` });
  }

  async create(data: CreateGradeInput): Promise<Grade> {
    return this.client.request<Grade>({ method: 'POST', path: '/grades', body: data });
  }

  async update(gid: number | string, data: UpdateGradeInput): Promise<Grade> {
    return this.client.request<Grade>({ method: 'PUT', path: `/grades/${gid}`, body: data });
  }

  async *listAll(params?: ListGradesParams): AsyncGenerator<Grade, void, undefined> {
    yield* this.client.listAll<Grade>('/grades', params as Record<string, unknown>);
  }
}
