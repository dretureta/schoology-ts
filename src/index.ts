// Schoology API TypeScript Client
export class SchoologyClient {
  constructor(config: { apiKey: string; apiSecret: string }) {
    if (!config.apiKey || !config.apiSecret) {
      throw new Error('apiKey and apiSecret are required');
    }
  }
}
