/** @fileoverview User routes. */

import express from 'express';

import {
  loginUserSanitizer,
  loginUserValidator,
  registerUserValidator,
} from '@/Middleware/validation/user.ts';
import { loginUser, registerUser } from '@/Controllers/user.ts';

export const userRouter = express.Router();

userRouter.post('/register', registerUserValidator, registerUser);
userRouter.post('/login', loginUserValidator, loginUserSanitizer, loginUser);
