import mongoose from 'mongoose';
import { Langs } from '../file-off/lang';

declare global {
    namespace Express {
        interface Request {
            userId: mongoose.Types.ObjectId;
            userLang: keyof Langs;
        }

        interface Application {
            $lang: Langs;
        }
    }
}
