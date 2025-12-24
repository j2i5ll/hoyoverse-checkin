export class CheckInError extends Error {
  constructor(message: string) {
    super(`CheckInError: ${message}`)
    this.name = 'CheckInError';
  }
}