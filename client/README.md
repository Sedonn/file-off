# File-off - Frontend

`Docs in developing`

Frontend part of File-off app created with Vue.js on Typescript.

## Table of Contents

- [Motivation](#motivation)
- [General info](#general-info)
- [Technologies](#technologies)
- [Project Setup](#project-setup)

## Motivation

The motivation for creating this project is the graduate qualification work on the educational program "Development of software products and design of information systems" in the direction of study "Software Engineering" at the Russian Technological University (RTU MIREA).

## General info

This is a frontend part of web-service for one time file exchange - File-off app. <br>
Backend part is placed in this repository [File-off - REST-API](https://github.com/Sedonn/file-off-REST-API)

## Technologies

### Core

- Vue.js version: 3.2.31
- Vue-router version: 4.0.14
- Vuex version: 4.0.2
- Typescript version: 4.5.5

### Libraries

- axios version: 0.26.1
- crypto-js version: 4.1.1
- js-cookie version: 3.0.1

### Dev

- @typescript-eslint/eslint-plugin version: 5.33.1
- @typescript-eslint/parser version: 5.33.1
- @vitejs/plugin-vue version: 2.2.4
- @vue/tsconfig version: 0.1.3
- eslint version: 8.22.0
- eslint-plugin-vue version: 9.3.0
- vite version: 2.8.6
- vue-tsc version: 0.31.4

## Project Setup

This part of the application should run secondly, than [backend part](https://github.com/Sedonn/file-off-REST-API). The `.env-example` file must be completed and renamed to `.env` before starting the project. Finally, to run application apply following commands:

```bash
npm install
npm run dev
```
