export class AppError extends Error {
  public readonly statusCode: number;

  public readonly code: string;

  public readonly details?: unknown;

  public readonly expose: boolean;

  constructor(
    statusCode: number,
    message: string,
    code = "APP_ERROR",
    details?: unknown,
    expose = true,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.expose = expose;
  }
}
