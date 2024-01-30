/** @fileoverview The main router. */

/* eslint-disable @typescript-eslint/no-unsafe-argument */

import express from 'express';
import passport from 'passport';

import { fileRouter } from './file.ts';
import { userRouter } from './user.ts';

export const mainRouter = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/file', passport.authenticate('jwt', { session: false }), fileRouter);
