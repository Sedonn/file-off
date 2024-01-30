/** @fileoverview Controllers for the operations with users. */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import type { NextFunction, Request, Response } from 'express';

import { UserModel } from '@/Models/user.ts';
import { JWT_TOKEN_SECRET } from '@/config.ts';
import { APIError } from '@/utils/APIError.ts';

import type { TJWTPayload, TUser } from '@/@types/index.d.ts';

type RegisterUserRequest = Request<object, object, TUser>;

/**
 * Create the new user.
 * @param req
 * @param res
 * @param next
 */
export const registerUser = async ({ body }: RegisterUserRequest, res: Response, next: NextFunction) => {
  const user = new UserModel({
    name: body.name,
    surname: body.surname,
    login: body.login,
    email: body.email,
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
 * Authorize the user.
 * @param req
 * @param res
 * @param next
 */
export const loginUser = async (
  { body }: LoginUserRequest,
  res: Response<{ token: string }>,
  next: NextFunction,
) => {
  const user = await UserModel.findOne({ login: body.login });
  if (!user || !(await bcrypt.compare(body.password, user.password))) {
    return next(new APIError(401, 'AUTHORIZATION_FAILED'));
  }

  const payload = { id: user._id.toString() } satisfies TJWTPayload;
  const token = jwt.sign(payload, JWT_TOKEN_SECRET, {
    expiresIn: body.remember ? '14d' : '1d',
  });

  return res.status(200).json({ token });
};
