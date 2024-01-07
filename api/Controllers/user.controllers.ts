import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { NextFunction, Request, Response } from 'express';
import { TUser } from '../@types';

import UserModel from '../Models/user';

import { JWT_TOKEN_SECRET } from '../config';
import APIError from '../utils/APIError';

type RegisterUserRequest = Request<object, object, TUser>;

/**
 * Function for user registration.
 * @param {RegisterUserRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const registerUser = async ({ body }: RegisterUserRequest, res: Response, next: NextFunction) => {
  const user = new UserModel({
    name: body.name,
    surname: body.surname,
    login: body.login,
    email: body.email,
    // Storing the password in the database as a hash
    password: await bcrypt.hash(body.password, 10),
  });
  try {
    await user.save();
  } catch (error) {
    return next(new APIError(500, 'REGISTER_FAILED'));
  }

  return res.status(200).end();
};

type LoginUserRequestBody = Pick<TUser, 'login' | 'password'> & {
  remember: boolean;
};

type LoginUserRequest = Request<object, object, LoginUserRequestBody>;

/**
 * Function for user logging.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const loginUser = async ({ body }: LoginUserRequest, res: Response, next: NextFunction) => {
  // Validating the user
  const user = await UserModel.findOne({ login: body.login });
  if (!user || !(await bcrypt.compare(body.password, user.password))) {
    return next(new APIError(401, 'AUTHORIZATION_FAILED'));
  }

  // Creating token and write user ID to token
  const payload = { id: user._id };
  const token = jwt.sign(payload, JWT_TOKEN_SECRET, {
    expiresIn: body.remember ? '14d' : '1d',
  });

  return res.status(200).json({ token });
};
