import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SchoologyClient } from '../../src/client';

describe('SchoologyClient.courses', () => {
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

  it('should list courses', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ data: [{ id: 1, title: 'Math 101' }], links: {} }),
    } as Response);

    const result = await client.courses.list();
    expect(result.data[0].title).toBe('Math 101');
  });

  it('should create course', async () => {
    fetchMock.mockResolvedValue({
      status: 201,
      json: () => Promise.resolve({ id: 1, title: 'New Course' }),
    } as Response);

    const result = await client.courses.create({ title: 'New Course' });
    expect(result.title).toBe('New Course');
  });

  it('should get course by id', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ id: 123, title: 'Science 202' }),
    } as Response);

    const result = await client.courses.get(123);
    expect(result.id).toBe(123);
    expect(result.title).toBe('Science 202');
  });

  it('should update course', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ id: 123, title: 'Updated Title' }),
    } as Response);

    const result = await client.courses.update(123, { title: 'Updated Title' });
    expect(result.title).toBe('Updated Title');
  });

  it('should delete course', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({}),
    } as Response);

    await expect(client.courses.delete(123)).resolves.toBeUndefined();
  });
});
