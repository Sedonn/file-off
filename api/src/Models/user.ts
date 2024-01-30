/** @fileoverview Creation of the user model. */

import { Schema, Model, model } from 'mongoose';

import type { TUser } from '@/@types/index.d.ts';

const userSchema = new Schema<TUser, Model<TUser>>({
  name: String,
  surname: String,
  login: String,
  email: String,
  password: String,
});

export const UserModel = model<TUser>('User', userSchema);
