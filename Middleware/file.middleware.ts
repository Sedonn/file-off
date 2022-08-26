import { body, checkSchema, validationResult, query } from 'express-validator';

import { Request, Response, NextFunction } from 'express';

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
