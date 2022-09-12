import app from '../app';

import { Request, Response } from 'express';

/**
 * Function for getting specific language.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
export const getLang = async (req: Request, res: Response) => {
    return res.status(200).json(app.$lang[req.userLang]);
};
