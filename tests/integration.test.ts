import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SchoologyClient } from '../src/client';

describe('Auto-pagination', () => {
  let client: SchoologyClient;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    client = new SchoologyClient({
      apiKey: 'test-key',
      apiSecret: 'test-secret',
    });
  });

  it('should iterate over all pages', async () => {
    fetchMock
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ data: [{ uid: 1 }], links: { next: 'https://api.schoology.com/v1/users?offset=1' } }),
      } as Response)
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ data: [{ uid: 2 }], links: {} }),
      } as Response);

    const users: number[] = [];
    for await (const user of client.users.listAll()) {
      users.push(user.uid);
    }
    expect(users).toEqual([1, 2]);
  });

  it('should handle courses listAll', async () => {
    fetchMock
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ data: [{ id: 1 }], links: { next: 'https://api.schoology.com/v1/courses?offset=1' } }),
      } as Response)
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ data: [{ id: 2 }], links: {} }),
      } as Response);

    const courseIds: number[] = [];
    for await (const course of client.courses.listAll()) {
      courseIds.push(course.id);
    }
    expect(courseIds).toEqual([1, 2]);
  });
});
