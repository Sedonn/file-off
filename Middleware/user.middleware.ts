import app from '../app';

import { body, CustomValidator, validationResult } from 'express-validator';

import { Request, Response, NextFunction } from 'express';

import UserModel from '../Models/user.model';
import { Lang } from '../@types/file-off/lang';

const userValidatorHandler = (req: Request, res: Response, next: NextFunction) => {
    const userValidationResult = validationResult.withDefaults({
        formatter: (error) => {
            return app.$lang[req.userLang][error.msg as keyof Lang];
        },
    });
    
    const errors = userValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    next();
};

const isLoginExists: CustomValidator = async (login) => {
    if (await UserModel.findOne({ login })) {
        throw new Error('API_ERROR_LOGIN_EXISTS')
    }

    return true;
}

const isEmailExists: CustomValidator = async (email) => {
    if (await UserModel.findOne({ email })) {
        throw new Error('API_ERROR_EMAIL_EXISTS')
    }

    return true;
}

export const registerValidator = [
    body('name')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_NAME_EMPTY'),
    body('surname')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_SURNAME_EMPTY'),
    body('login')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_LOGIN_EMPTY')
        .bail()
        .custom(isLoginExists),
    body('email')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_EMAIL_EMPTY')
        .bail()
        .isEmail()
        .withMessage('API_ERROR_EMAIL_INVALID')
        .custom(isEmailExists),
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_PASSWORD_EMPTY')
        .bail()
        .isLength({ min: 8 })
        .withMessage('API_ERROR_PASSWORD_SHORT'),
        userValidatorHandler
];

export const loginValidator = [
    body('login')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_LOGIN_EMPTY'),
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_PASSWORD_EMPTY'),
        userValidatorHandler
];

export const loginSanitizer = [
    body('remember').toBoolean(),
];
