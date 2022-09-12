import { SHA256 } from 'crypto-js';
import jwt from 'jsonwebtoken';
import app from '../app';

import { Request, Response } from 'express';

import UserModel from '../Models/user.model';

import { createErrorMessage, createResultMessage } from '../utils/message.utils';

/**
 * Function for user registration.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
export const registerUser = async (req: Request, res: Response) => {
    const user = new UserModel({
        name: req.body.name,
        surname: req.body.surname,
        login: req.body.login,
        email: req.body.email,
        // Storing the password in the database as a hash
        password: SHA256(req.body.password).toString(),
    });
    try {
        await user.save();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(createErrorMessage(app.$lang[req.userLang].API_USER_CREATE_ERROR));
    }

    return res.status(200).json(createResultMessage(app.$lang[req.userLang].API_USER_CREATE_ERROR));
};

/**
 * Function for user logging.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
export const loginUser = async (req: Request, res: Response) => {
    // Validating the user
    const user = await UserModel.findOne({ login: req.body.login });
    if (!user || user.password !== SHA256(req.body.password).toString()) {
        return res.status(401).json(createErrorMessage(app.$lang[req.userLang].API_AUTH_FAILED));
    }

    // Creating token and write user ID to token
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET!, { 
        expiresIn: req.body.remember ? '14d' : '1d' 
    });

    return res.status(200).json({ token });
};

/**
 * Function for getting user profile.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
export const getProfile = async (req: Request, res: Response) =>
    res.status(200).json(await UserModel.findOne({ _id: req.userId }, { _id: 0, password: 0, __v: 0 }));

/**
 * Function for handling successful result of authentication middleware.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
export const authResult = async (req: Request, res: Response) => 
    res.status(200).json(createResultMessage(app.$lang[req.userLang].API_AUTH_DONE));
