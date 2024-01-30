/** @fileoverview Validators and sanitizers for the operations with users. */

/* eslint-disable newline-per-chained-call */

import { body, type CustomValidator } from 'express-validator';

import { UserModel } from '@/Models/user.ts';
import { defaultValidatorHandler } from './index.ts';

/**
 * Verifies that the {@link login} is unique.
 * @param login
 */
const isLoginExists: CustomValidator = async (login: string) => {
  if (await UserModel.findOne({ login })) {
    throw new Error('DUPLICATE_LOGIN');
  }

  return true;
};

/**
 * Verifies that the {@link login} is unique.
 * @param login
 */
const isEmailExists: CustomValidator = async (email: string) => {
  if (await UserModel.findOne({ email })) {
    throw new Error('DUPLICATE_EMAIL');
  }

  return true;
};

/** Validation for the register method. */
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

/** Validation for the login method. */
export const loginUserValidator = [
  body('login').exists({ checkFalsy: true }).withMessage('LOGIN_EMPTY'),
  body('password').exists({ checkFalsy: true }).withMessage('PASSWORD_EMPTY'),
  defaultValidatorHandler,
];

/** Converts data for the login method. */
export const loginUserSanitizer = [body('remember').toBoolean()];
