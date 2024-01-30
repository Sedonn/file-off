/* eslint-disable no-underscore-dangle */

/** @fileoverview Setting up the app authorization. */

import { Types } from 'mongoose';
import { Strategy as JWTStrategy, ExtractJwt, type StrategyOptions } from 'passport-jwt';

import { UserModel } from '@/Models/user.ts';
import { JWT_TOKEN_SECRET } from '@/config.ts';
import { APIError } from '@/utils/APIError.ts';

import type { TJWTPayload } from '@/@types/index.js';

const strategyOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_TOKEN_SECRET,
};

export const fileOffJWTStrategy = new JWTStrategy(strategyOptions, async ({ id }: TJWTPayload, done) => {
  if (!(await UserModel.findById(id).exec())) {
    return done(new APIError(401, 'AUTHORIZATION_FAILED'), undefined);
  }

  return done(null, { id: new Types.ObjectId(id) });
});
