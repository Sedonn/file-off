import mongoose from 'mongoose';
import streamifier from 'streamifier';

import { Request, Response, NextFunction } from 'express';

export module FileControllers {
    export const uploadFile = async (req: Request, res: Response) => {
        if (req.file) {
            const bucket = await new mongoose.mongo.GridFSBucket(mongoose.connection.db);

            streamifier.createReadStream(req.file.buffer)
                .pipe(bucket.openUploadStream(req.file.filename, {
                    metadata: { status: 'awaiting' },
                }));

            res.json({ status: 'uploaded' });
        } else {
            res.json({ error: 'file upload error' });
        }
    };

    export const downloadFile = (req: Request, res: Response, next: NextFunction) => {

    };
}
