import express from 'express';

import { UserControllers } from '../Controllers/user.controllers';

import checkAuth from '../Middleware/auth.middleware'

const router = express.Router();

router.post('/register', UserControllers.registerUser);
router.post('/login', UserControllers.loginUser);
router.get('/profile', checkAuth, UserControllers.getProfile)

export default router;