export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedFetcher<T> {
  (params: PaginationParams & Record<string, unknown>): Promise<{
    data: T[];
    links: { next?: string; prev?: string };
  }>;
}

export function parseCursorParams(url: string): PaginationParams {
  if (!url) return {};
  try {
    const parsed = new URL(url);
    const params: PaginationParams = {};
    const limit = parsed.searchParams.get('limit');
    const offset = parsed.searchParams.get('offset');
    if (limit) params.limit = parseInt(limit, 10);
    if (offset) params.offset = parseInt(offset, 10);
    return params;
  } catch {
    return {};
  }
}

export async function* buildPaginatedIterator<T>(
  fetcher: PaginatedFetcher<T>,
  initialParams: Record<string, unknown>
): AsyncGenerator<T, void, undefined> {
  let currentParams = { ...initialParams };
  let hasMore = true;

  while (hasMore) {
    const result = await fetcher(currentParams as PaginationParams);
    for (const item of result.data) {
      yield item;
    }
    if (result.links.next) {
      currentParams = parseCursorParams(result.links.next);
    } else {
      hasMore = false;
    }
  }
}
