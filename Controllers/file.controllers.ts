import mongoose from 'mongoose';
import streamifier from 'streamifier';

import { Request, Response } from 'express';
import { FileMetadata } from '../@types/file-off/interfaces';
import UserModel from '../Models/user.model';

export module FileControllers {
    export const uploadFile = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
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

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
        streamifier.createReadStream(req.file.buffer).pipe(bucket.openUploadStream(req.file.originalname, { metadata }));

        return res.status(200).json({ message: 'uploaded' });
    };

    export const downloadFile = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
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

        bucket.openDownloadStream(file._id).pipe(res);

        return res.status(200);
    };

    export const deleteFile = async (req: Request, res: Response) => {
        if (!req.body.filename) {
            return res.status(400).json({ error: 'bad request' });
        }

        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db);
        const fileId = (await db.collection('fs.files').findOne({
            $and: [{ filename: req.body.filename }, { 'metadata.senderId': req.userId }],
        }))?._id;

        if (!fileId){
            return res.status(404).json({ error: 'file not found' });
        }

        await bucket.delete(fileId);

        return res.status(200).json({ message: 'file deleted' });
    };

    export const userFiles = async (req: Request, res: Response) => {
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

    export const userDownloads = async (req: Request, res: Response) => {
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
