import express from 'express';

import * as LangControllers from '../Controllers/lang.controllers';

import * as LangMiddleware from '../Middleware/lang.middleware';

const router = express.Router();

router.get('/lang', LangMiddleware.getLangSanitizer, LangControllers.getLang);

export default router;
