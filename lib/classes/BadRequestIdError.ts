export class BadRequestIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestIdError";
  }
}
