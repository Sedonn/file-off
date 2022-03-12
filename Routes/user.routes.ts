import express from 'express';

import { UserControllers } from '../Controllers/user.controllers';

const router = express.Router();

router.post('/register', UserControllers.registerUser);
router.post('/login', UserControllers.loginUser);

export default router;