import type { Submission, ListSubmissionsParams, CreateSubmissionInput, UpdateSubmissionInput } from '../types/submission.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class SubmissionsResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListSubmissionsParams): Promise<SchoologyListResponse<Submission>> {
    return this.client.request<SchoologyListResponse<Submission>>({
      method: 'GET',
      path: '/submissions',
      params: params as Record<string, unknown>,
    });
  }

  async get(sid: number | string): Promise<Submission> {
    return this.client.request<Submission>({ method: 'GET', path: `/submissions/${sid}` });
  }

  async create(aid: number | string, data: CreateSubmissionInput): Promise<Submission> {
    return this.client.request<Submission>({ method: 'POST', path: `/assignments/${aid}/submissions`, body: data });
  }

  async update(sid: number | string, data: UpdateSubmissionInput): Promise<Submission> {
    return this.client.request<Submission>({ method: 'PUT', path: `/submissions/${sid}`, body: data });
  }

  async *listAll(params?: ListSubmissionsParams): AsyncGenerator<Submission, void, undefined> {
    yield* this.client.listAll<Submission>('/submissions', params as Record<string, unknown>);
  }
}
