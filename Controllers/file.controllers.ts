import { Request, Response } from 'express';
import { FileMetadata } from '../@types/file-off/interfaces';

import UserModel from '../Models/user.model';
import FileStorage from '../Models/fileStorage';

export module FileControllers {
    export const uploadFile = async (req: Request, res: Response) => {
        const reciever = await UserModel.findOne({ login: req.body.reciever });
        if (!reciever) {
            return res.status(404).json({ error: 'reciever not found' });
        }
        
        const fileStorage = new FileStorage();
        const file = req.file!;
        if (await fileStorage.getFileBySender(req.userId, file.originalname)) {
            return res.status(404).json({ error: 'file is already exists' });
        }
        
        const metadata: FileMetadata = {
            mimetype: file.mimetype,
            senderId: req.userId,
            receiverId: reciever._id,
        };
        const uploadStream = fileStorage.writeFile(file, metadata);
        uploadStream.on('finish', async () => {
            res.status(200).json(await fileStorage.getUploadData(uploadStream.id)).end();
        });
    };

    export const downloadFile = async (req: Request, res: Response) => {
        const fileStorage = new FileStorage();
        
        const file = await fileStorage.getFileByReceiver(req.userId, req.query.filename!.toString());
        if (!file) {
            return res.status(404).json({ error: 'file not found' });
        }

        res.setHeader('Content-disposition', `attachment; filename=${file.filename}`);
        res.setHeader('Content-type', file.metadata.mimetype);

        const downloadStream = fileStorage.getFileDownloadStream(file._id).pipe(res);
        downloadStream.on('finish', async () => {
            await fileStorage.deleteFile(file._id);
            res.status(200).end();
        });
    };

    export const deleteFile = async (req: Request, res: Response) => {
        const fileStorage = new FileStorage();

        const file = await fileStorage.getFileBySender(req.userId, req.body.filename);
        if (!file) {
            return res.status(404).json({ error: 'file not found' });
        }

        await fileStorage.deleteFile(file._id);

        return res.status(200).json({ message: 'file deleted' });
    };

    export const getUserFiles = async (req: Request, res: Response) => {
        const fileStorage = new FileStorage();

        const files = await fileStorage.getUploadFiles(req.userId);
        if (!files.length) {
            return res.status(404).json({ error: 'files not found' });
        }

        return res.status(200).json(files);
    };

    export const getUserDownloads = async (req: Request, res: Response) => {
        const fileStorage = new FileStorage();

        const files = await fileStorage.getDownloadFiles(req.userId);
        if (!files.length) {
            return res.status(404).json({ error: 'files not found' });
        }

        return res.status(200).json(files);
    };
}
