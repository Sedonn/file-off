import { SHA256 } from 'crypto-js';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';

import UserModel from '../Models/user.models';

export module UserControllers {
    export const registerUser = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
        if (!(req.body.name && req.body.surname && req.body.login && req.body.email && req.body.password)) {
            return res.status(400).json({ error: 'bad request' });
        }

        if (await UserModel.findOne({ login: req.body.login })) {
            return res.status(409).json({ error: 'login is existing' });
        }

        const user = new UserModel({
            name: req.body.name,
            surname: req.body.surname,
            login: req.body.login,
            email: req.body.email,
            password: SHA256(req.body.password).toString(),
        });
        await user.save();

        return res.status(200).json({ message: 'user created' });
    };

    export const loginUser = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
        if (!(req.body.login && req.body.password)) {
            return res.status(400).json({ error: 'bad request' });
        }

        const user = await UserModel.findOne({ login: req.body.login });
        if (!user || user.password !== SHA256(req.body.password).toString()) {
            return res.status(401).json({ error: 'auth failed' });
        }

        const payload = {
            _id: user._id,
            name: user.name,
            login: user.login,
            email: user.email,
        };
        const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET!, { expiresIn: '1d' });

        return res.status(200).json({ message: 'user authorized', token });
    };
}
