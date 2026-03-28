import { describe, it, expect } from 'vitest';
import { createOAuthSignature } from '../src/oauth';

describe('createOAuthSignature', () => {
  it('should create consistent signature for same inputs', () => {
    const signature1 = createOAuthSignature({
      method: 'GET',
      url: 'https://api.schoology.com/v1/users',
      params: { oauth_consumer_key: 'key1', oauth_timestamp: '1234567890', oauth_nonce: 'abc' },
      consumerSecret: 'secret1',
      tokenSecret: '',
    });
    const signature2 = createOAuthSignature({
      method: 'GET',
      url: 'https://api.schoology.com/v1/users',
      params: { oauth_consumer_key: 'key1', oauth_timestamp: '1234567890', oauth_nonce: 'abc' },
      consumerSecret: 'secret1',
      tokenSecret: '',
    });
    expect(signature1).toBe(signature2);
  });

  it('should create different signature for different inputs', () => {
    const sig1 = createOAuthSignature({
      method: 'GET',
      url: 'https://api.schoology.com/v1/users',
      params: { oauth_consumer_key: 'key1', oauth_timestamp: '1234567890', oauth_nonce: 'abc' },
      consumerSecret: 'secret1',
      tokenSecret: '',
    });
    const sig2 = createOAuthSignature({
      method: 'GET',
      url: 'https://api.schoology.com/v1/users',
      params: { oauth_consumer_key: 'key1', oauth_timestamp: '1234567890', oauth_nonce: 'xyz' },
      consumerSecret: 'secret1',
      tokenSecret: '',
    });
    expect(sig1).not.toBe(sig2);
  });
});
