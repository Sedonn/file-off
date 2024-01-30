# File-off - Backend part

Backend part of File-off app created with Express.js on Typescript.

## Table of Contents

- [File-off - Backend part](#file-off---backend-part)
  - [Table of Contents](#table-of-contents)
  - [Code style](#code-style)
  - [Environment](#environment)
  - [Technologies](#technologies)
    - [Core dependencies](#core-dependencies)
    - [Common dependencies](#common-dependencies)
    - [Development dependencies](#development-dependencies)

## Code style

![Сode style - Airbnb](https://user-images.githubusercontent.com/59235713/189879167-2451932a-746e-43e8-996f-7829eec98c45.svg)

## Environment

The backend part of app contains these environment variables:

- `DB_URL` - MongoDB connection string.
- `PORT` - Port for Express server.
- `JWT_TOKEN_SECRET` - JWT token secret.
- `CORS_ALLOW_ORIGINS` - CORS settings.

## Technologies

### Core dependencies

- express: 4.18.2
- express-validator: 7.0.1
- multer: 1.4.5-lts.1
- mongoose: 8.1.1

### Common dependencies

- bcrypt: 5.1.1
- jsonwebtoken: 9.0.2
- cors: 2.8.5
- passport-jwt: 4.0.1
- passport: 0.7.0

### Development dependencies

- @swc/cli: 0.3.0
- @swc/core: 1.3.106
- @swc/plugin-transform-imports: 1.5.114
- @types/bcrypt: 5.0.2
- @types/cors: 2.8.17
- @types/express: 4.17.21
- @types/jsonwebtoken: 8.5.9
- @types/multer: 1.4.11
- @types/node: 20.11.10
- @types/passport-jwt: 3.0.13
- @typescript-eslint/eslint-plugin: 6.19.1
- @typescript-eslint/parser: 6.19.1
- eslint-config-airbnb-base: 15.0.0
- eslint-config-airbnb-typescript: 17.1.0
- eslint-plugin-import: 2.29.1
- eslint: 8.56.0
- nodemon: 3.0.3
- tsx: 4.7.0
- typescript: 5.3.3
