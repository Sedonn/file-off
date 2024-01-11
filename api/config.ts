/** @fileoverview Variables from {@link process.env} with some default values */

export const {
  CORS_ALLOW_ORIGINS,
  DB_URL = 'mongodb://127.0.0.1:27017/file-off',
  PORT = 443,
  JWT_TOKEN_SECRET = '123',
} = process.env;
