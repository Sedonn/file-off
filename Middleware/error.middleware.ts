/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

import { NextFunction, Request, RequestHandler, Response } from 'express';

import APIError from '../utils/APIError';

import { ErrorResponse } from '../@types';

/** Middleware which sending all API errors to the client. */
const globalErrorHandler = async (
  error: Error | APIError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) => {
  if (error instanceof APIError) {
    return res.status(error.httpCode).json({ errorCode: [error.errorCode] });
  }

  console.error(error);

  return res.status(500).json({ errorCode: ['UNKNOWN_ERROR'] });
};

export default globalErrorHandler;
