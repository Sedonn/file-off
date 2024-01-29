/** @fileoverview Setting up the app authorization. */

import { Types } from 'mongoose';
import { Strategy as JWTStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

import UserModel from '../Models/user';
import { JWT_TOKEN_SECRET } from '../config';
import APIError from '../utils/APIError';

const strategyOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_TOKEN_SECRET,
};

const fileOffJWTStrategy = new JWTStrategy(strategyOptions, async ({ id }, done) => {
  const user = await UserModel.findById(id);

  if (!user) {
    return done(new APIError(401, 'AUTHORIZATION_FAILED'), undefined);
  }

  return done(null, { id: new Types.ObjectId(user.id) });
});

export default fileOffJWTStrategy;
