import { Request, Response } from 'express';

import { FileMetadata } from '../@types/file-off';

import UserModel from '../Models/user.model';
import FileStorage from '../Models/fileStorage';

import { createErrorMessage, createResultMessage } from '../utils/message.utils';

export const uploadFile = async (req: Request, res: Response) => {
    const reciever = await UserModel.findOne({ login: req.body.reciever });
    if (!reciever) {
        return res.status(404).json(createErrorMessage('Reciever not found.'));
    }
    if (reciever.login === (await UserModel.findById(req.userId))?.login) {
        return res.status(404).json(createErrorMessage('Reciever cant be equal to your login.'));
    }
    
    const fileStorage = new FileStorage();
    const file = req.file!;
    if (await fileStorage.getFileBySender(req.userId, file.originalname, reciever._id)) {
        return res.status(400).json(createErrorMessage('File is already exists.'));
    }
    
    const metadata: FileMetadata = {
        mimetype: file.mimetype,
        senderId: req.userId,
        receiverId: reciever._id,
    };
    const uploadStream = fileStorage.writeFile(file, metadata);
    uploadStream.on('finish', async () => {
        res.status(200).json(await fileStorage.getUploadData(uploadStream.id));
    });
    uploadStream.on('error', async (error: Error) => {
        res.status(400).json(createErrorMessage(error.message));
    });
};

export const downloadFile = async (req: Request, res: Response) => {
    const fileStorage = new FileStorage();
    
    const file = await fileStorage.getFileByReceiver(req.userId, req.query.filename!.toString());
    if (!file) {
        return res.status(404).json(createErrorMessage('File not found.'));
    }

    res.setHeader('Content-disposition', `attachment; filename=${file.filename}`);
    res.setHeader('Content-type', file.metadata.mimetype);

    const downloadStream = fileStorage.getFileDownloadStream(file._id).pipe(res);
    downloadStream.on('finish', async () => {
        await fileStorage.deleteFile(file._id);
        res.status(200).end();
    });
    downloadStream.on('error', async (error: Error) => {
        res.status(400).json(createErrorMessage(error.message));
    });
};

export const deleteFile = async (req: Request, res: Response) => {
    const fileStorage = new FileStorage();

    const reciever = await UserModel.findOne({ login: req.body.reciever });
    if (!reciever) {
        return res.status(404).json(createErrorMessage('Reciever not found.'));
    }

    const file = await fileStorage.getFileBySender(req.userId, req.body.filename, reciever._id);
    if (!file) {
        return res.status(404).json(createErrorMessage('File not found.'));
    }

    try {
        await fileStorage.deleteFile(file._id);
    } catch (error) {
        console.log(error);
        return res.status(500).json(createErrorMessage("File delete error."))
    }

    return res.status(200).json(createResultMessage('File deleted.'));
};

export const getUserFiles = async (req: Request, res: Response) => {
    const fileStorage = new FileStorage();

    const files = await fileStorage.getUploadFiles(req.userId);
    if (!files.length) {
        return res.status(404).json(createErrorMessage('Files not found.'));
    }

    return res.status(200).json(files);
};

export const getUserDownloads = async (req: Request, res: Response) => {
    const fileStorage = new FileStorage();

    const files = await fileStorage.getDownloadFiles(req.userId);
    if (!files.length) {
        return res.status(404).json(createErrorMessage('Files not found.'));
    }

    return res.status(200).json(files);
};
