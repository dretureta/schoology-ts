import type { Event, ListEventsParams } from '../types/event.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class EventsResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListEventsParams): Promise<SchoologyListResponse<Event>> {
    return this.client.request<SchoologyListResponse<Event>>({
      method: 'GET',
      path: '/events',
      params: params as Record<string, unknown>,
    });
  }

  async get(eid: number | string): Promise<Event> {
    return this.client.request<Event>({ method: 'GET', path: `/events/${eid}` });
  }

  async *listAll(params?: ListEventsParams): AsyncGenerator<Event, void, undefined> {
    yield* this.client.listAll<Event>('/events', params as Record<string, unknown>);
  }
}
