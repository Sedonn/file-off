import { CustomSanitizer, CustomValidator, validationResult } from 'express-validator';

import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { ErrorResponse } from '../../@types';

/**
 * Default validation handler for "express-validator" validators.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const defaultValidatorHandler = (req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  const defaultValidationResult = validationResult.withDefaults({
    formatter: (error) => error.msg,
  });

  const errors = defaultValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorCode: errors.array() });
  }

  return next();
};

export const isObjectId: CustomValidator = (value: string) => {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error('FILE_ID_CORRUPTED');
  }

  return true;
};

export const toObjectId: CustomSanitizer = (value: string) => new Types.ObjectId(value);

export default defaultValidatorHandler;
