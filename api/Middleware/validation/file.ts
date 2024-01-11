import { body, buildCheckFunction, checkSchema, query } from 'express-validator';

import { isValidExpirePeriod } from '../../Models/expireDate';
import defaultValidatorHandler, { isObjectId, toObjectId } from '.';

const createFileIdValidationChain = (context: ReturnType<typeof buildCheckFunction>) =>
  context('fileId').exists({ checkFalsy: true }).withMessage('FILE_ID_EMPTY').bail().custom(isObjectId);

/**
 * Validates data on "upload-file" route.
 * @filename file.routes.ts
 */
export const uploadFileValidator = [
  checkSchema({
    file: {
      custom: {
        options: (value, { req }) => req.file,
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

/**
 * Validates data on "download-file" route.
 * @filename file.routes.ts
 */
export const downloadFileValidator = [createFileIdValidationChain(query), defaultValidatorHandler];

export const downloadFileSanitizer = [query('fileId').customSanitizer(toObjectId)];

/**
 * Validates data on "delete-file" route.
 * @filename file.routes.ts
 */
export const deleteFileValidator = [createFileIdValidationChain(body), defaultValidatorHandler];

export const deleteFileSanitizer = [body('fileId').customSanitizer(toObjectId)];
