import app from '../app';

import { Request, Response } from 'express';

export const getLang = async (req: Request, res: Response) => {
    return res.status(200).json(app.$lang[req.userLang]);
};
