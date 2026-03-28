import { describe, it, expect } from 'vitest';
import { SchoologyApiError, SchoologyAuthError } from '../src/errors';

describe('SchoologyApiError', () => {
  it('should create error with status and message', () => {
    const error = new SchoologyApiError(400, 'Bad Request', 'INVALID_PARAM');
    expect(error.status).toBe(400);
    expect(error.message).toBe('Bad Request');
    expect(error.code).toBe('INVALID_PARAM');
    expect(error instanceof Error).toBe(true);
  });
});

describe('SchoologyAuthError', () => {
  it('should create error for auth failures', () => {
    const error = new SchoologyAuthError('Invalid API key');
    expect(error.message).toBe('Invalid API key');
    expect(error instanceof SchoologyApiError).toBe(true);
    expect(error.status).toBe(401);
  });
});
