import { TAPIErrorCode } from '../@types';

class APIError extends Error {
  /** Http error code. */
  public readonly httpCode: number;

  /** Known error code of the app. */
  public readonly errorCode: TAPIErrorCode;

  constructor(httpCode: number, errorCode: TAPIErrorCode) {
    super(errorCode);

    this.httpCode = httpCode;
    this.errorCode = errorCode;
  }
}

export default APIError;
