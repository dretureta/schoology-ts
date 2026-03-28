import { describe, it, expect, vi, beforeEach } from 'vitest';
import nock from 'nock';
import { SchoologyClient } from '../src/client';

describe('SchoologyClient', () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  it('should create client with config', () => {
    const client = new SchoologyClient({
      apiKey: 'my-key',
      apiSecret: 'my-secret',
    });
    expect(client).toBeDefined();
  });

  it('should throw SchoologyAuthError on 401', async () => {
    nock('https://api.schoology.com/v1')
      .get('/users')
      .reply(401, { error: 'Invalid API key' });

    const client = new SchoologyClient({
      apiKey: 'bad-key',
      apiSecret: 'bad-secret',
    });

    await expect(client.request({ method: 'GET', path: '/users' }))
      .rejects.toThrow('Invalid API key');
  });
});
