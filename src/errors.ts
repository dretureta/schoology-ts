export class SchoologyApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'SchoologyApiError';
  }
}

export class SchoologyAuthError extends SchoologyApiError {
  constructor(message: string) {
    super(401, message, 'AUTH_ERROR');
    this.name = 'SchoologyAuthError';
  }
}
