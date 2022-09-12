import express from 'express';

import * as UserControllers from '../Controllers/user.controllers';

import checkAuth from '../Middleware/auth.middleware';
import * as UserMiddleware from '../Middleware/user.middleware';

const router = express.Router();

// Setting the "User" routes
router.post('/register', UserMiddleware.registerValidator, UserControllers.registerUser);
router.post('/login', UserMiddleware.loginValidator, UserMiddleware.loginSanitizer, UserControllers.loginUser);
router.get('/profile', checkAuth, UserControllers.getProfile);
router.post('/auth', checkAuth, UserControllers.authResult);

export default router;
