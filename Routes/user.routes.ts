import express from 'express';

import { UserControllers } from '../Controllers/user.controllers';

import checkAuth from '../Middleware/auth.middleware';
import { UserMiddleware } from '../Middleware/user.middleware';

const router = express.Router();

router.post('/register', UserMiddleware.registerValidator, UserControllers.registerUser);
router.post('/login', UserMiddleware.loginValidator, UserControllers.loginUser);
router.get('/profile', checkAuth, UserControllers.getProfile);
router.post('/auth', checkAuth, UserControllers.authResult);

export default router;
