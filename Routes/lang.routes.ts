import express from 'express';

import getLang from '../Controllers/lang.controllers';
import getLangSanitizer from '../Middleware/lang.middleware';

const router = express.Router();

// Setting the "Lang" routes
router.get('/lang', getLangSanitizer, getLang);

export default router;
