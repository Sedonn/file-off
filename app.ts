import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import fileRouter from './Routes/file.routes';

dotenv.config();

const DB_URL: string = process.env.DB_URL!;
const PORT: number = +process.env.PORT!;

const app = express();

app.use('/api', fileRouter);

mongoose
    .connect(DB_URL)
    .then(() => console.log('Database is connected.'))
    .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`App listening at port: ${PORT}`));
