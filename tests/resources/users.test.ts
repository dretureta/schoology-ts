import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SchoologyClient } from '../../src/client';

describe('SchoologyClient.users', () => {
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

  it('should list users', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ data: [{ uid: 1, display_name: 'Test User', short_display_name: 'Test', email: 'test@example.com', role: 'student' }], links: {} }),
    } as Response);

    const result = await client.users.list();
    expect(result.data[0].uid).toBe(1);
    expect(result.data[0].display_name).toBe('Test User');
  });

  it('should get user by id', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ uid: 123, display_name: 'Test User', short_display_name: 'Test', email: 'test@example.com', role: 'teacher' }),
    } as Response);

    const result = await client.users.get(123);
    expect(result.uid).toBe(123);
  });
});
