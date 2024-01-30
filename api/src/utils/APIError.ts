import type { TAPIErrorCode } from '@/@types/index.d.ts';

export class APIError extends Error {
  /** Http error code. */
  public readonly httpCode: number;

  /** Known error code of the app. */
  public readonly errorCode: TAPIErrorCode;

  /** Instance of a error, if exists. */
  public readonly errorInstance?: unknown;

  constructor(httpCode: number, errorCode: TAPIErrorCode, errorInstance: unknown = undefined) {
    super(errorCode);

    this.httpCode = httpCode;
    this.errorCode = errorCode;
    this.errorInstance = errorInstance;
  }
}
