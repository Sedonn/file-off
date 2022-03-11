import jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization!.split(' ')[1];
    jwt.verify(token, process.env.JWT_TOKEN_SECRET!, (err: any, user: any) => {
        if (err) return res.status(403).json({error: 'auth failed'});
        else next();
    });
};

export default auth;
