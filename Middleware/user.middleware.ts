import { body, CustomValidator } from 'express-validator';

import UserModel from '../Models/user.model';
import defaultValidatorHandler from './defaultValidationHandler';

/**
 * Custom validator for cheking existence of login.
 * @param {string} login
 * @returns - Error or "true"
 */
const isLoginExists: CustomValidator = async (login: string) => {
    if (await UserModel.findOne({ login })) {
        throw new Error('API_ERROR_LOGIN_EXISTS');
    }

    return true;
};

/**
 * Custom validator for cheking existence of email.
 * @param {string} email
 * @returns - Error or "true"
 */
const isEmailExists: CustomValidator = async (email: string) => {
    if (await UserModel.findOne({ email })) {
        throw new Error('API_ERROR_EMAIL_EXISTS');
    }

    return true;
};

/**
 * Validates data on "register" route.
 * @filename user.routes.ts
 */
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
    defaultValidatorHandler,
];

/**
 * Validates data on "login" route.
 * @filename user.routes.ts
 */
export const loginValidator = [
    body('login')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_LOGIN_EMPTY'),
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('API_ERROR_PASSWORD_EMPTY'),
    defaultValidatorHandler,
];

/**
 * Sanitaizes data on "login" route.
 * @filename user.routes.ts
 */
export const loginSanitizer = [
    body('remember').toBoolean(),
];
