import { describe, it, expect, vi } from 'vitest';
import { buildPaginatedIterator, parseCursorParams } from '../src/pagination';

describe('parseCursorParams', () => {
  it('should parse cursor from URL', () => {
    const url = 'https://api.schoology.com/v1/users?limit=100&offset=100';
    const params = parseCursorParams(url);
    expect(params).toEqual({ limit: 100, offset: 100 });
  });

  it('should return empty object for URL without params', () => {
    const url = 'https://api.schoology.com/v1/users';
    const params = parseCursorParams(url);
    expect(params).toEqual({});
  });
});

describe('buildPaginatedIterator', () => {
  it('should iterate over paginated results', async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce({ data: [{ id: 1 }], links: { next: 'http://example.com?offset=1' } })
      .mockResolvedValueOnce({ data: [{ id: 2 }], links: {} });

    const iterator = buildPaginatedIterator(fetcher, {});
    const results = [];

    for await (const item of iterator) {
      results.push(item);
    }

    expect(results).toEqual([{ id: 1 }, { id: 2 }]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
