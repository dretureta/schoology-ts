import { SchoologyApiError, SchoologyAuthError } from './errors.js';
import { buildPaginatedIterator, PaginationParams } from './pagination.js';
import { generateOAuthHeader } from './oauth.js';
import { UsersResource } from './resources/users.js';

export interface SchoologyClientConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
  maxRetries?: number;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  params?: Record<string, unknown>;
  body?: unknown;
}

export interface SchoologyClientInterface {
  request<T>(options: RequestOptions): Promise<T>;
  listAll<T>(path: string, params?: Record<string, unknown>): AsyncGenerator<T, void, undefined>;
}

export class SchoologyClient implements SchoologyClientInterface {
  private readonly baseUrl: string;
  private readonly maxRetries: number;

  constructor(config: SchoologyClientConfig) {
    this.baseUrl = config.baseUrl ?? 'https://api.schoology.com/v1';
    this.maxRetries = config.maxRetries ?? 3;
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.users = new UsersResource(this);
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const { method, path, params, body } = options;
    const url = `${this.baseUrl}${path}`;
    const searchParams = this.buildSearchParams(params);

    let lastError: Error | undefined;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.doRequest(method, url, searchParams, body);
        return response as T;
      } catch (error) {
        if (error instanceof SchoologyApiError && error.status === 429 && attempt < this.maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000);
          continue;
        }
        throw error;
      }
    }
    throw lastError!;
  }

  private async doRequest(
    method: string,
    url: string,
    searchParams: URLSearchParams,
    body: unknown
  ): Promise<unknown> {
    const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

    const authHeader = generateOAuthHeader(method, fullUrl, this.apiKey, this.apiSecret);

    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      throw new SchoologyAuthError('Invalid API key or secret');
    }

    if (response.status >= 400) {
      const errorBody = await response.json().catch(() => ({}));
      throw new SchoologyApiError(
        response.status,
        (errorBody as { message?: string }).message ?? response.statusText,
        (errorBody as { code?: string }).code
      );
    }

    return response.json();
  }

  private buildSearchParams(params?: Record<string, unknown>): URLSearchParams {
    const searchParams = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
    }
    return searchParams;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async *listAll<T>(path: string, initialParams?: Record<string, unknown>): AsyncGenerator<T, void, undefined> {
    const fetcher = async (params: PaginationParams): Promise<{ data: T[]; links: { next?: string; prev?: string } }> => {
      return this.request({ method: 'GET', path, params: { ...initialParams, ...params } });
    };
    yield* buildPaginatedIterator(fetcher, initialParams ?? {});
  }

  users: UsersResource;

  private apiKey: string;
  private apiSecret: string;
}
