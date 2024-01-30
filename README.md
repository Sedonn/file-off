# File-off

The web service for one time file exchange created with Vue.js and Express.js on Typescript.

## Table of Contents

- [File-off](#file-off)
  - [Table of Contents](#table-of-contents)
  - [Motivation](#motivation)
  - [General info](#general-info)
  - [Technologies](#technologies)
  - [Environment](#environment)
  - [Project Setup](#project-setup)
    - [Development mode](#development-mode)
    - [Production mode](#production-mode)

## Motivation

The motivation for creating this project is the graduate qualification work on the educational program "Development of software products and design of information systems" in the direction of study "Software Engineering" at the Russian Technological University (RTU MIREA).

## General info

This is main docs about web-service for one time file exchange - File-off app.

Frontend part docs is placed [here](https://github.com/Sedonn/file-off/tree/master/client).

Backend part docs is placed [here](https://github.com/Sedonn/file-off/tree/master/api).

## Technologies

- Node.js: 20.9.0
- Mongo DB: 5.0.6

## Environment

The entire app contains these environment variables:

- `JWT_TOKEN_SECRET` - JWT secret for the API.
- `MONGO_INITDB_ROOT_PASSWORD` - Password for the DB.

## Project Setup

**The project launch requires Docker**. The Project launch is configured in two modes:

- `development`
- `production`

The `.env.{mode}.example` file must be configured and renamed to `.env.{mode}` before starting the project.

### Development mode

To run the project in the `development` mode run following script `start-development.bat`.

### Production mode

To run the project in the `production` mode run following script `start-production.bat`
