import type { Course, ListCoursesParams, CreateCourseInput, UpdateCourseInput } from '../types/course.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class CoursesResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListCoursesParams): Promise<SchoologyListResponse<Course>> {
    return this.client.request<SchoologyListResponse<Course>>({
      method: 'GET',
      path: '/courses',
      params: params as Record<string, unknown>,
    });
  }

  async get(cid: number | string): Promise<Course> {
    return this.client.request<Course>({ method: 'GET', path: `/courses/${cid}` });
  }

  async create(data: CreateCourseInput): Promise<Course> {
    return this.client.request<Course>({ method: 'POST', path: '/courses', body: data });
  }

  async update(cid: number | string, data: UpdateCourseInput): Promise<Course> {
    return this.client.request<Course>({ method: 'PUT', path: `/courses/${cid}`, body: data });
  }

  async delete(cid: number | string): Promise<void> {
    await this.client.request({ method: 'DELETE', path: `/courses/${cid}` });
  }

  async *listAll(params?: ListCoursesParams): AsyncGenerator<Course, void, undefined> {
    yield* this.client.listAll<Course>('/courses', params as Record<string, unknown>);
  }
}
