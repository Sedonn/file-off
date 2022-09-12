import mongoose from 'mongoose';
import { Langs } from '../file-off/lang';

declare global {
    namespace Express {
        /**
         * Add user id and lang key to Express Request.
         */
        interface Request {
            userId: mongoose.Types.ObjectId;
            userLang: keyof Langs;
        }

        /**
         * Add all available languages to Express Apllication.
         */
        interface Application {
            $lang: Langs;
        }
    }
}
