/** @fileoverview Validators and sanitizers for the operations with files. */

/* eslint-disable newline-per-chained-call */
/* eslint-disable implicit-arrow-linebreak */

import { body, buildCheckFunction, checkSchema, query, type Meta } from 'express-validator';

import { isValidExpirePeriod } from '@/Models/expireDate.ts';
import { defaultValidatorHandler, isObjectId, toObjectId } from './index.ts';

/**
 * Factory method that creates a validation chain for a certain request context.
 * @param context
 */
const createFileIdValidationChain = (context: ReturnType<typeof buildCheckFunction>) =>
  context('fileId').exists({ checkFalsy: true }).withMessage('FILE_ID_EMPTY').bail().custom(isObjectId);

/** Validation for the uploadFile method. */
export const uploadFileValidator = [
  checkSchema({
    file: {
      custom: {
        options: (value, { req }: Meta) => !!req.file,
        errorMessage: 'FILE_EMPTY',
      },
    },
  }),
  body('receiver').exists({ checkFalsy: true }).withMessage('RECEIVER_EMPTY'),
  body('expireAt')
    .exists({ checkFalsy: true })
    .withMessage('EXPIRE_PERIOD_EMPTY')
    .bail()
    .custom(isValidExpirePeriod)
    .withMessage('EXPIRE_PERIOD_INVALID'),
  defaultValidatorHandler,
];

/** Validation for the downloadFile method. */
export const downloadFileValidator = [createFileIdValidationChain(query), defaultValidatorHandler];

/** Converts data for the downloadFile method. */
export const downloadFileSanitizer = [query('fileId').customSanitizer(toObjectId)];

/** Validation for the deleteFile method. */
export const deleteFileValidator = [createFileIdValidationChain(body), defaultValidatorHandler];

/** Converts data for the deleteFile method. */
export const deleteFileSanitizer = [body('fileId').customSanitizer(toObjectId)];
