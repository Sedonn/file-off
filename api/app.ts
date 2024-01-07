/* eslint-disable no-console */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';

import routes from './Routes';

import { CORS_ALLOW_ORIGINS, DB_URL, PORT } from './config';
import fileOffJWTStrategy from './Middleware/auth.middleware';
import FileStorage from './Models/FileStorage';
import globalErrorHandler from './Middleware/error.middleware';

passport.use(fileOffJWTStrategy);

const app = express();

app.use(passport.initialize());

app.use(express.json());

app.use(
  cors({
    origin: CORS_ALLOW_ORIGINS,
  }),
);

app.use('/api', routes);
app.use(globalErrorHandler);

const initApp = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Database is connected.');

    app.$fileStorage = new FileStorage();

    app.listen(PORT, () => console.log(`App listening at port: ${PORT}`));
  } catch (error) {
    process.exit(1);
  }
};

initApp();
