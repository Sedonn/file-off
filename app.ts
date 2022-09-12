import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { Request, Response, NextFunction } from 'express';

import fileRouter from './Routes/file.routes';
import userRouter from './Routes/user.routes';
import langRouter from './Routes/lang.routes';

import { langsInit, getValidLang } from './lang/main';
import { Langs } from './@types/file-off/lang';

// Loading the .env file
dotenv.config();
const DB_URL: string = process.env.DB_URL!;
const PORT: number = +process.env.PORT!;

const app = express();

// Using middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Using CORS to allow requests from client side
app.use(
    cors({
        origin: process.env.CORS_ALLOW_ORIGINS,
    })
);

// Loading custom languages
app.$lang = langsInit();
console.log('Localization is loaded.');
// Setting user language
app.use(function (req: Request, res: Response, next: NextFunction) {
    req.userLang = getValidLang(req.acceptsLanguages()[0]) as keyof Langs; 
    next();
});

// Setting app routes
app.use('/api', userRouter, fileRouter, langRouter);

// Connecting to MondoDB
mongoose
    .connect(DB_URL)
    .then(() => console.log('Database is connected.'))
    .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`App listening at port: ${PORT}`));

export default app;
