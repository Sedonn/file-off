import mongoose from 'mongoose';
import streamifier from 'streamifier';

import { Request, Response} from 'express';

export module FileControllers {
    export const uploadFile = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
        if (!req.file) {
            return res.status(400).json({ error: 'file upload error' });
        }

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);

        streamifier.createReadStream(req.file.buffer).pipe(
            bucket.openUploadStream(req.file.originalname, {
                metadata: { mimetype: req.file.mimetype },
            })
        );

        return res.status(200).json({ message: 'uploaded' });
    };

    export const downloadFile = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
        if (!req.query.filename) {
            return res.status(400).json({ error: 'bad request' });
        }

        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db);
        const fileCollection = db.collection('fs.files');
        const file = await fileCollection.findOne({ filename: req.query.filename });

        if (!file) {
            return res.status(404).json({ error: 'file not found' });
        }

        res.setHeader('Content-disposition', `attachment; filename=${file.filename}`);
        res.setHeader('Content-type', file.metadata.mimetype);

        bucket.openDownloadStream(file._id).pipe(res);

        return res.status(200);
    };
}
