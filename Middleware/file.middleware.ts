import { body, checkSchema, validationResult, query } from 'express-validator';

import { Request, Response, NextFunction } from 'express';

import { isValidExpirePeriod } from '../utils/expireDate.utils';

const fileValidatorHandler = (req: Request, res: Response, next: NextFunction) => {
    const fileValidationResult = validationResult.withDefaults({
        formatter: (error) => {
            return error.msg;
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
                errorMessage: 'File upload error.',
            },
        },
    }),
    body('reciever')
        .exists({ checkFalsy: true })
        .withMessage('Reciever field can not be empty.'),
    body('expireAt')
        .exists({ checkFalsy: true })
        .withMessage('Expire field can not be empty.')
        .bail()
        .custom(isValidExpirePeriod)
        .withMessage('Expire value not valid.'),
    fileValidatorHandler,
];

export const downloadFileValidator = [
    query('filename')
        .exists({ checkFalsy: true })
        .withMessage('Filename field can not be empty.'),
    fileValidatorHandler
];

export const deleteFileValidator = [
    body('filename')
        .exists({ checkFalsy: true })
        .withMessage('Filename field can not be empty.'),
    body('reciever')
        .exists({ checkFalsy: true })
        .withMessage('Reciever field can not be empty.'),
    fileValidatorHandler
];
