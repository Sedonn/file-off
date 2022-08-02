import mongoose from 'mongoose';
import streamifier from 'streamifier';

import { Request, Response } from 'express';
import { FileMetadata } from '../@types/file-off/interfaces';
import UserModel from '../Models/user.model';

export module FileControllers {
    export const uploadFile = async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ error: 'file upload error' });
        }

        if (!req.body.reciever) {
            return res.status(400).json({ error: 'bad request' });
        }

        const reciever = await UserModel.findOne({ login: req.body.reciever });
        if (!reciever) {
            return res.status(404).json({ error: 'reciever not found' });
        }

        const metadata: FileMetadata = {
            mimetype: req.file.mimetype,
            senderId: req.userId,
            receiverId: reciever._id,
        };

        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db);
        const uploadStream = streamifier.createReadStream(req.file.buffer).pipe(bucket.openUploadStream(req.file.originalname, { metadata }));
        uploadStream.on('finish', async () => {
            const fileCollection = db.collection('fs.files');
            const file = await fileCollection.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'metadata.receiverId',
                        foreignField: '_id',
                        as: 'receiverData',
                    },
                },
                {
                    $match: { _id: uploadStream.id },
                },
                {
                    $project: {
                        _id: 0,
                        uploadDate: 1,
                        filename: 1,
                        'receiverData.login': 1,
                    },
                },
            ]).toArray();

            res.status(200).json(file[0]).end();
        });
    };

    export const downloadFile = async (req: Request, res: Response) => {
        if (!req.query.filename) {
            return res.status(400).json({ error: 'bad request' });
        }

        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db);
        const fileCollection = db.collection('fs.files');
        const file = await fileCollection.findOne({
            $and: [{ filename: req.query.filename }, { 'metadata.receiverId': req.userId }],
        });

        if (!file) {
            return res.status(404).json({ error: 'file not found' });
        }

        res.setHeader('Content-disposition', `attachment; filename=${file.filename}`);
        res.setHeader('Content-type', file.metadata.mimetype);

        const downloadStream = bucket.openDownloadStream(file._id).pipe(res);
        downloadStream.on('finish', () => {
            bucket.delete(file._id);
            res.status(200).end();
        });
    };

    export const deleteFile = async (req: Request, res: Response) => {
        if (!req.body.filename) {
            return res.status(400).json({ error: 'bad request' });
        }

        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db);
        const file = await db.collection('fs.files').findOne({
            $and: [{ filename: req.body.filename }, { 'metadata.senderId': req.userId }],
        });

        if (!file) {
            return res.status(404).json({ error: 'file not found' });
        }

        await bucket.delete(file._id);

        return res.status(200).json({ message: 'file deleted' });
    };

    export const getUserFiles = async (req: Request, res: Response) => {
        const files = await mongoose.connection.db
            .collection('fs.files')
            .aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'metadata.receiverId',
                        foreignField: '_id',
                        as: 'receiverData',
                    },
                },
                {
                    $match: { 'metadata.senderId': req.userId },
                },
                {
                    $project: {
                        _id: 0,
                        uploadDate: 1,
                        filename: 1,
                        'receiverData.login': 1,
                    },
                },
            ])
            .toArray();

        if (!files.length) {
            return res.status(404).json({ error: 'files not found' });
        }

        return res.status(200).json(files);
    };

    export const getUserDownloads = async (req: Request, res: Response) => {
        const files = await mongoose.connection.db
            .collection('fs.files')
            .aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'metadata.senderId',
                        foreignField: '_id',
                        as: 'senderData',
                    },
                },
                {
                    $match: { 'metadata.receiverId': req.userId },
                },
                {
                    $project: {
                        _id: 0,
                        uploadDate: 1,
                        filename: 1,
                        'senderData.login': 1,
                    },
                },
            ])
            .toArray();

        if (!files.length) {
            return res.status(404).json({ error: 'files not found' });
        }

        return res.status(200).json(files);
    };
}
