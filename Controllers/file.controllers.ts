import mongoose from 'mongoose';
import streamifier from 'streamifier';

import { Request, Response, NextFunction } from 'express';

export module FileControllers {
    export const uploadFile = async (req: Request, res: Response) => {
        if (req.file) {
            const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);

            streamifier.createReadStream(req.file.buffer).pipe(
                bucket.openUploadStream(req.file.originalname, {
                    metadata: { mimetype: req.file.mimetype },
                })
            );

            return res.json({ status: 'uploaded' });
        } else {
            return res.status(400).json({ error: 'file upload error' });
        }
    };

    export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
        if (req.query['file-name']) {
            const db = mongoose.connection.db;
            const bucket = new mongoose.mongo.GridFSBucket(db);

            const fileCollection = db.collection('fs.files');
            const file = await fileCollection.findOne({ filename: req.query['file-name'] });

            if (file) {
                res.setHeader('Content-disposition', `attachment; filename=${file.filename}`);
                res.setHeader('Content-type', file.metadata.mimetype);

                bucket.openDownloadStream(file._id).pipe(res);
            } else {
                return res.status(404).json({ error: 'file not found' });
            }
        } else {
            return res.status(400).json({ error: 'bad request' });
        }
    };
}
