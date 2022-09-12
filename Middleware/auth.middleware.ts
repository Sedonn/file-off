import jwt, { VerifyErrors } from 'jsonwebtoken';
import mongoose from 'mongoose';

import { Request, Response, NextFunction } from 'express';

import app from '../app';
import { createErrorMessage } from '../utils/message.utils';

/**
 * Middleware for authorization, which cheking the JWT.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express NextFunction callback.
 */
const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    jwt.verify(token!, process.env.JWT_TOKEN_SECRET!, (err: VerifyErrors | null, user: any) => {
        if (err) {
            return res.status(403).json(createErrorMessage(app.$lang[req.userLang].API_AUTH_FAILED));
        }

        req.userId = new mongoose.Types.ObjectId(user.id);

        return next();
    });
};

export default auth;
