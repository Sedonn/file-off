import mongoose from 'mongoose';

import { TUser } from '../@types';

// Creating the user Schema
const userSchema = new mongoose.Schema<TUser>({
  name: String,
  surname: String,
  login: String,
  email: String,
  password: String,
});

export default mongoose.model<TUser>('User', userSchema);
