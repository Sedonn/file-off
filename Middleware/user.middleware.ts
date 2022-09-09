import { body, CustomValidator } from 'express-validator';

import UserModel from '../Models/user.model';
import { defaultValidatorHandler } from './defaultValidationHandler';

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
        defaultValidatorHandler
];

export const loginValidator = [
    body('login')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_LOGIN_EMPTY'),
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_PASSWORD_EMPTY'),
        defaultValidatorHandler
];

export const loginSanitizer = [
    body('remember').toBoolean(),
];
