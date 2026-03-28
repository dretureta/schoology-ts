import type { Assignment, ListAssignmentsParams, CreateAssignmentInput, UpdateAssignmentInput } from '../types/assignment.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class AssignmentsResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListAssignmentsParams): Promise<SchoologyListResponse<Assignment>> {
    return this.client.request<SchoologyListResponse<Assignment>>({
      method: 'GET',
      path: '/assignments',
      params: params as Record<string, unknown>,
    });
  }

  async get(aid: number | string): Promise<Assignment> {
    return this.client.request<Assignment>({ method: 'GET', path: `/assignments/${aid}` });
  }

  async create(courseId: number | string, data: CreateAssignmentInput): Promise<Assignment> {
    return this.client.request<Assignment>({ method: 'POST', path: `/courses/${courseId}/assignments`, body: data });
  }

  async update(aid: number | string, data: UpdateAssignmentInput): Promise<Assignment> {
    return this.client.request<Assignment>({ method: 'PUT', path: `/assignments/${aid}`, body: data });
  }

  async delete(aid: number | string): Promise<void> {
    await this.client.request({ method: 'DELETE', path: `/assignments/${aid}` });
  }

  async *listAll(params?: ListAssignmentsParams): AsyncGenerator<Assignment, void, undefined> {
    yield* this.client.listAll<Assignment>('/assignments', params as Record<string, unknown>);
  }
}
