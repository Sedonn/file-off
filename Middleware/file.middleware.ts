import app from '../app';
import { body, checkSchema, validationResult, query } from 'express-validator';

import { Request, Response, NextFunction } from 'express';

import { isValidExpirePeriod } from '../utils/expireDate.utils';
import { Lang } from '../@types/file-off/lang';

const fileValidatorHandler = (req: Request, res: Response, next: NextFunction) => {
    const fileValidationResult = validationResult.withDefaults({
        formatter: (error) => {
            return app.$lang[req.userLang][error.msg as keyof Lang];
        },
    });

    const errors = fileValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    next();
};

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
    fileValidatorHandler,
];

export const downloadFileValidator = [
    query('filename')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_FILENAME_EMPTY'),
    fileValidatorHandler
];

export const deleteFileValidator = [
    body('filename')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_FILENAME_EMPTY'),
    body('reciever')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_RECIEVER_EMPTY'),
    fileValidatorHandler
];
