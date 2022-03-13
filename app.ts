import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import fileRouter from './Routes/file.routes';
import userRouter from './Routes/user.routes';

dotenv.config();

const DB_URL: string = process.env.DB_URL!;
const PORT: number = +process.env.PORT!;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: process.env.CORS_ALLOW_ORIGINS,
    })
);

app.use('/api', userRouter, fileRouter);

mongoose
    .connect(DB_URL)
    .then(() => console.log('Database is connected.'))
    .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`App listening at port: ${PORT}`));
