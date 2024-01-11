import { NextFunction, Request, Response } from 'express';

import { Types } from 'mongoose';

import { ExpirePeriod, TUserFileMetaData } from '../@types';

import UserModel from '../Models/user';
import { createExpireDate } from '../Models/expireDate';
import APIError from '../utils/APIError';

type UploadFileRequestBody = {
  /** Login of a file receiver. */
  receiver: string;
  /** Type of a expire period. */
  expireAt: ExpirePeriod;
};

type UploadFileRequest = Request<object, object, UploadFileRequestBody>;

/**
 * Function for upload the file.
 * @param {UploadFileRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const uploadFile = async (
  { app, body, user, file }: UploadFileRequest,
  res: Response,
  next: NextFunction,
) => {
  const { $fileStorage } = app;

  const receiver = await UserModel.findOne({ login: body.receiver });
  if (!receiver) {
    return next(new APIError(404, 'RECEIVER_NOT_FOUND'));
  }

  if (receiver._id.equals(user!.id)) {
    return next(new APIError(400, 'SENDER_EQUALS_RECEIVER'));
  }

  // Checking existing of file with equal filename and receiver
  if (await $fileStorage.isUploadingFileUnique(user!.id, file!.originalname, receiver._id)) {
    return next(new APIError(400, 'DUPLICATE_FILE'));
  }

  // Uploading file to database
  const metadata = {
    mimetype: file!.mimetype,
    senderId: user!.id,
    receiverId: receiver._id,
    expireAt: createExpireDate(body.expireAt),
  } satisfies TUserFileMetaData;

  try {
    const uploadedFile = await $fileStorage.saveFile(file!, metadata);
    return res.status(200).json(uploadedFile);
  } catch {
    return next(new APIError(500, 'FILE_UPLOAD_FAILED'));
  }
};

type DownloadFileRequestQuery = {
  fileId: Types.ObjectId;
};

type DownloadFileRequest = Request<object, object, object, DownloadFileRequestQuery>;

/**
 * Function for download the file.
 * @param {DownloadFileRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const downloadFile = async (
  { app, user, query }: DownloadFileRequest,
  res: Response,
  next: NextFunction,
) => {
  const { $fileStorage } = app;

  // Checking existing of file
  const file = await $fileStorage.getDownloadableFile(user!.id, new Types.ObjectId(query.fileId));
  if (!file) {
    return next(new APIError(404, 'FILE_NOT_FOUND'));
  }

  // Set response headers before download
  res.setHeader('Content-disposition', 'attachment;');
  res.setHeader('Content-type', file.metadata.mimetype);

  return $fileStorage
    .getFileDownloadStream(file._id)
    .pipe(res)
    .on('finish', async () => {
      // Delete after download
      await $fileStorage.deleteFile(file._id);
      res.status(200).end();
    })
    .on('error', () => next(new APIError(500, 'FILE_DOWNLOAD_FAILED')));
};

type DeleteFileRequestBody = {
  fileId: Types.ObjectId;
};

type DeleteFileRequest = Request<object, object, DeleteFileRequestBody>;

/**
 * Function for delete the file.
 * @param {DeleteFileRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const deleteFile = async (
  { app, body, user }: DeleteFileRequest,
  res: Response,
  next: NextFunction,
) => {
  const { $fileStorage } = app;
  const { fileId } = body;

  const fileExistPromises = await Promise.all([
    $fileStorage.isFileExistsInUploadedFiles(user!.id, fileId),
    $fileStorage.isFileExistsInDownloadableFiles(user!.id, fileId),
  ]);

  if (!fileExistPromises.some(Boolean)) {
    return next(new APIError(404, 'FILE_NOT_FOUND'));
  }

  try {
    await $fileStorage.deleteFile(fileId);
  } catch (error) {
    return next(new APIError(500, 'FILE_DELETE_FAILED'));
  }

  return res.status(200).end();
};

/**
 * Function for getting all files uploaded by user.
 * @param {Request} req
 * @param {Response} res
 */
export const getUploadedFiles = async ({ app, user }: Request, res: Response) => {
  const { $fileStorage } = app;

  const files = await $fileStorage.getUploadedFiles(user!.id);

  return res.status(200).json(files);
};

/**
 * Function for getting all available to user downloads.
 * @param {Request} req
 * @param {Response} res
 */
export const getDownloadableFiles = async ({ app, user }: Request, res: Response) => {
  const { $fileStorage } = app;

  const files = await $fileStorage.getDownloadableFiles(user!.id);

  return res.status(200).json(files);
};
