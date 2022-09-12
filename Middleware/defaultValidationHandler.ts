import { validationResult } from 'express-validator';

import { Request, Response, NextFunction } from 'express';

import app from '../app';
import { Lang } from '../@types/file-off/lang';

/**
 * Default validation handler for "express-validator" validators.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express NextFunction callback.
 */
const defaultValidatorHandler = (req: Request, res: Response, next: NextFunction) => {
    // Creating custom format of error message
    const defaultValidationResult = validationResult.withDefaults({
        formatter: (error) => app.$lang[req.userLang][error.msg as keyof Lang],
    });

    const errors = defaultValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    return next();
};

export default defaultValidatorHandler;
