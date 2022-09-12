import { Request, Response } from 'express';

import app from '../app';

/**
 * Function for getting specific language.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
const getLang = async (req: Request, res: Response) =>
    res.status(200).json(app.$lang[req.userLang]);

export default getLang;
