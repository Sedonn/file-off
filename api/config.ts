/** @fileoverview Variables from {@link process.env} with some default values */

import path from 'path';
import { config } from 'dotenv';

// Loading the current environment from .env file
config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV}`) });

export const {
  NODE_ENV,
  CORS_ALLOW_ORIGINS,
  DB_URL = 'mongodb://127.0.0.1:27017/file-off',
  PORT = 443,
  JWT_TOKEN_SECRET = '123',
} = process.env;
