import { SHA256 } from 'crypto-js';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';

import UserModel from '../Models/user.model';

import { createErrorMessage, createResultMessage } from '../utils/message.utils';

export const registerUser = async (req: Request, res: Response) => {
    const user = new UserModel({
        name: req.body.name,
        surname: req.body.surname,
        login: req.body.login,
        email: req.body.email,
        password: SHA256(req.body.password).toString(),
    });
    try {
        await user.save();
    }
    catch (error) {
        console.log(error);
        res.status(500).json(createErrorMessage('User creating error.'));
    }

    return res.status(200).json(createResultMessage('User created.'));
};

export const loginUser = async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ login: req.body.login });
    if (!user || user.password !== SHA256(req.body.password).toString()) {
        return res.status(401).json(createErrorMessage('Auth failed.'));
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET!, { 
        expiresIn: req.body.remember ? '14d' : '1d' 
    });

    return res.status(200).json({ token });
};

export const getProfile = async (req: Request, res: Response) =>
    res.status(200).json(await UserModel.findOne({ _id: req.userId }, { _id: 0, password: 0, __v: 0 }));

export const authResult = async (req: Request, res: Response) => 
    res.status(200).json(createResultMessage('Auth successful.'));
