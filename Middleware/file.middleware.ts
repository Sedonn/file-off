import { body, checkSchema, query } from 'express-validator';
import { isValidExpirePeriod } from '../utils/expireDate.utils';
import defaultValidatorHandler from './defaultValidationHandler';

/**
 * Validates data on "upload-file" route.
 * @filename file.routes.ts
 */
export const uploadFileValidator = [
    checkSchema({
        file: {
            custom: {
                options: (value, { req }) => req.file,
                errorMessage: 'API_ERROR_FILE_UPLOAD',
            },
        },
    }),
    body('reciever')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_RECIEVER_EMPTY'),
    body('expireAt')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_EXPIRE_EMPTY')
        .bail()
        .custom(isValidExpirePeriod)
        .withMessage('API_ERROR_EXPIRE_INVALID'),
    defaultValidatorHandler,
];

/**
 * Validates data on "download-file" route.
 * @filename file.routes.ts
 */
export const downloadFileValidator = [
    query('filename')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_FILENAME_EMPTY'),
    defaultValidatorHandler,
];

/**
 * Validates data on "delete-file" route.
 * @filename file.routes.ts
 */
export const deleteFileValidator = [
    body('filename')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_FILENAME_EMPTY'),
    body('reciever')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_RECIEVER_EMPTY'),
    defaultValidatorHandler,
];
