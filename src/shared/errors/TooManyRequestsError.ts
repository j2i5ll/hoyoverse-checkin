export class TooManyRequestsError extends Error {
  constructor(public readonly url: string) {
    super(`Too Many Requests: ${url}`);
    this.name = 'TooManyRequestsError';
  }
}
