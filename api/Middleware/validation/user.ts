import { body, CustomValidator } from 'express-validator';

import UserModel from '../../Models/user';
import defaultValidatorHandler from '.';

/**
 * Custom validator for checking existence of login.
 * @param {string} login
 * @returns - Error or "true"
 */
const isLoginExists: CustomValidator = async (login: string) => {
  if (await UserModel.findOne({ login })) {
    throw new Error('DUPLICATE_LOGIN');
  }

  return true;
};

/**
 * Custom validator for checking existence of email.
 * @param {string} email
 * @returns - Error or "true"
 */
const isEmailExists: CustomValidator = async (email: string) => {
  if (await UserModel.findOne({ email })) {
    throw new Error('DUPLICATE_EMAIL');
  }

  return true;
};

/**
 * Validates data on "register" route.
 * @filename user.routes.ts
 */
export const registerUserValidator = [
  body('name').exists({ checkFalsy: true }).withMessage('NAME_EMPTY'),
  body('surname').exists({ checkFalsy: true }).withMessage('SURNAME_EMPTY'),
  body('login').exists({ checkFalsy: true }).withMessage('LOGIN_EMPTY').bail().custom(isLoginExists),
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('EMAIL_EMPTY')
    .bail()
    .isEmail()
    .withMessage('EMAIL_INVALID')
    .custom(isEmailExists),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('PASSWORD_EMPTY')
    .bail()
    .isLength({ min: 8 })
    .withMessage('PASSWORD_SHORT'),
  defaultValidatorHandler,
];

/**
 * Validates data on "login" route.
 * @filename user.routes.ts
 */
export const loginUserValidator = [
  body('login').exists({ checkFalsy: true }).withMessage('LOGIN_EMPTY'),
  body('password').exists({ checkFalsy: true }).withMessage('PASSWORD_EMPTY'),
  defaultValidatorHandler,
];

/**
 * Sanitizes data on "login" route.
 * @filename user.routes.ts
 */
export const loginUserSanitizer = [body('remember').toBoolean()];
