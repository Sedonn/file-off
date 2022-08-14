import jwt, { VerifyErrors } from 'jsonwebtoken';
import mongoose from 'mongoose';

import { Request, Response, NextFunction } from 'express';

import { createErrorMessage } from '../utils/message.utils';


const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    jwt.verify(token!, process.env.JWT_TOKEN_SECRET!, (err: VerifyErrors | null, user: any) => {
        if (err) {
            return res.status(403).json(createErrorMessage('Auth failed.'));
        }
        
        req.userId = new mongoose.Types.ObjectId(user.id);

        next();
    });
};

export default auth;
