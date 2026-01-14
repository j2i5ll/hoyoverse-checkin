export class RetryLaterError extends Error {
  constructor(
    public readonly retcode: number,
    message?: string,
  ) {
    super(message || `Retry later: retcode ${retcode}`);
    this.name = 'RetryLaterError';
  }
}
