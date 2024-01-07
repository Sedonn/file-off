import express from 'express';
import passport from 'passport';

import fileRouter from './file';
import userRouter from './user';

const router = express.Router();

router.use('/user', userRouter);
router.use('/file', passport.authenticate('jwt', { session: false }), fileRouter);

export default router;
