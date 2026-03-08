export class JsonParseError extends Error {
  constructor(
    public readonly url: string,
    public readonly status: number,
    public readonly responseBody: string,
  ) {
    super(`JSON parse error: ${url} (${status})`);
    this.name = 'JsonParseError';
  }
}
