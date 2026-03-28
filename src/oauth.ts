import { createHmac } from 'crypto';

export interface SignatureParams {
  method: string;
  url: string;
  params: Record<string, string>;
  consumerSecret: string;
  tokenSecret: string;
}

export function createOAuthSignature(params: SignatureParams): string {
  const { method, url, params: oauthParams, consumerSecret, tokenSecret } = params;

  // Sort and encode parameters
  const sortedParams = Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
    .join('&');

  // Create signature base string
  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams),
  ].join('&');

  // Create signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;

  // HMAC-SHA1
  const signature = createHmac('sha1', signingKey)
    .update(signatureBase)
    .digest('base64');

  return signature;
}

export function generateOAuthHeader(
  method: string,
  url: string,
  apiKey: string,
  apiSecret: string,
  additionalParams: Record<string, string> = {}
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateNonce();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    ...additionalParams,
  };

  const signature = createOAuthSignature({
    method,
    url,
    params: oauthParams,
    consumerSecret: apiSecret,
    tokenSecret: '',
  });

  oauthParams.oauth_signature = signature;

  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');

  return authHeader;
}

function generateNonce(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
