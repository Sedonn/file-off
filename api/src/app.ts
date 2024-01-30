/* eslint-disable no-console */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';

import { mainRouter } from '@/Routes/index.ts';
import { CORS_ALLOW_ORIGINS, DB_URL, PORT } from '@/config.ts';
import { fileOffJWTStrategy } from '@/Middleware/authentication.ts';
import { fileStorage } from '@/Models/FileStorage.ts';
import { globalErrorHandler } from '@/Middleware/error.ts';

passport.use(fileOffJWTStrategy);

const app = express();

app.use(passport.initialize());

app.use(express.json());

app.use(
  cors({
    origin: CORS_ALLOW_ORIGINS,
  }),
);

app.use('/api', mainRouter);
app.use(globalErrorHandler);

try {
  await mongoose.connect(DB_URL);
  console.log('Database is connected.');

  await fileStorage.connect();

  app.listen(PORT, () => console.log(`App listening at port: ${PORT}`));
} catch (error) {
  console.error(error);
  process.exit(1);
}
