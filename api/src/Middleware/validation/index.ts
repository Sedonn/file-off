/** @fileoverview Common validators and sanitizers. */

import { validationResult } from 'express-validator';
import { Types } from 'mongoose';

import type { CustomSanitizer, CustomValidator, ValidationError } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

import type { ErrorResponse, TAPIErrorCode } from '@/@types/index.d.ts';

/**
 * Default validation handler for all validation chains.
 * @param req
 * @param res
 * @param next
 */
export const defaultValidatorHandler = (req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  const defaultValidationResult = validationResult.withDefaults({
    formatter: (error: ValidationError) => error.msg as TAPIErrorCode,
  });

  const errors = defaultValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorCode: errors.array() });
  }

  return next();
};

/**
 * Verifies that the {@link value} is a valid MongoDB object identifier.
 * @param value
 */
export const isObjectId: CustomValidator = (value: string) => {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error('FILE_ID_CORRUPTED');
  }

  return true;
};

/**
 * Converts the {@link value} to MongoDB object identifier type.
 * @param value
 */
export const toObjectId: CustomSanitizer = (value: string) => new Types.ObjectId(value);
