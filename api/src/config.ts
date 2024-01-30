/** @fileoverview Variables from {@link process.env} with casting to certain types. */

export const { CORS_ALLOW_ORIGINS, DB_URL, JWT_TOKEN_SECRET } = process.env;

export const PORT = parseInt(process.env.PORT, 10);
