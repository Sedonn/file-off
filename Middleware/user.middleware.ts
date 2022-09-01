import { body, CustomValidator, validationResult } from 'express-validator';

import { Request, Response, NextFunction } from 'express';

import UserModel from '../Models/user.model';

const userValidatorHandler = (req: Request, res: Response, next: NextFunction) => {
    const userValidationResult = validationResult.withDefaults({
        formatter: (error) => {
            return error.msg;
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
        throw new Error('Login is existing.')
    }

    return true;
}

export const registerValidator = [
    body('name')
        .exists({ checkFalsy: true })
        .withMessage('Name field can not be empty.'),
    body('surname')
        .exists({ checkFalsy: true })
        .withMessage('Surname field can not be empty.'),
    body('login')
        .exists({ checkFalsy: true })
        .withMessage('Login field can not be empty.')
        .custom(isLoginExists),
    body('email')
        .exists({ checkFalsy: true })
        .withMessage('Email field can not be empty.')
        .bail()
        .isEmail()
        .withMessage('Email not valid.'),
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('Password field can not be empty.')
        .bail()
        .isLength({ min: 8 })
        .withMessage('Password should be greater than 8 symbols.'),
        userValidatorHandler
];

export const loginValidator = [
    body('login')
        .exists({ checkFalsy: true })
        .withMessage('Login field can not be empty.'),
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('Password field can not be empty.'),
        userValidatorHandler
];

export const loginSanitizer = [
    body('remember').toBoolean(),
];
