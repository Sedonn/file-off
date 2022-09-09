import app from "../app";
import { validationResult } from "express-validator";

import { Request, Response, NextFunction } from 'express';
import { Lang } from "../@types/file-off/lang";

export const defaultValidatorHandler = (req: Request, res: Response, next: NextFunction) => {
    const defaultValidationResult = validationResult.withDefaults({
        formatter: (error) => {
            return app.$lang[req.userLang][error.msg as keyof Lang];
        },
    });

    const errors = defaultValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    next();
};