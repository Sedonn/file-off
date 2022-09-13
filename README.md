# File-off - REST-API

Backend part of File-off app created with Node.js, Express.js and MongoDB on Typescript.

## Table of Contents

* [General info](#general-info)
* [Motivation](#motivation)
* [Code style](#code-style)
* [Technologies](#technologies)
* [Project Setup](#project-setup)

## Motivation

The motivation for creating this project is the graduate qualification work on the educational program "Development of software products and design of information systems" in the direction of study "Software Engineering" at the Russian Technological University (RTU MIREA).

## General info

This is a backend part of web-service for one time file exchange - File-off app. <br>
Frontend part is placed in this repository [File-off - frontend](https://github.com/Sedonn/file-off-frontend)

## Code style

![Сode style - Airbnb](https://user-images.githubusercontent.com/59235713/189879167-2451932a-746e-43e8-996f-7829eec98c45.svg)

## Technologies

### Core

* Node.js version: 14.17.3
* Express.js version: 4.18.1
* MongoDB version: 5.0.6
* Mongoose version: 6.5.2
* Typescript version: 4.7.4

### Libraries 

* bson version: 4.7.0
* cors version: 2.8.5
* crypto-js version: 4.1.1
* dotenv version: 16.0.2
* express-validator version: 6.14.2
* jsonwebtoken version: 8.5.1
* multer version: 1.4.4
* streamifier version: 0.1.1

### Dev

* ts-node version: 10.9.1
* nodemon version: 2.0.19
* eslint version: 8.21.0
* eslint-config-airbnb-base version: 15.0.0
* eslint-config-airbnb-typescript version: 17.0.0
* eslint-plugin-import version: 2.26.0
* @typescript-eslint/eslint-plugin version: 5.33.0
* @typescript-eslint/parser version: 5.33.0

## Project Setup

This part of the application should run first. The ".env-example" file must be completed and renamed to ".env" before starting the prtoject. Finally, to run API apply following commands:

```bash
npm install
npm run dev
```
