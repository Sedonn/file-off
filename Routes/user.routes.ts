import express from 'express';

import { UserControllers } from '../Controllers/user.controllers';

const router = express.Router();

router.post('/login', UserControllers.loginUser);
router.post('/register', UserControllers.registerUser);

export default router;