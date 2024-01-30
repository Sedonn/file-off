/** @fileoverview Controllers for the operations with files. */

import { Types } from 'mongoose';
import type { NextFunction, Request, Response } from 'express';

import { UserModel } from '@/Models/user.ts';
import { createExpireDate } from '@/Models/expireDate.ts';
import { APIError } from '@/utils/APIError.ts';
import { fileStorage } from '@/Models/FileStorage.ts';

import type {
  ExpirePeriod,
  TUserDownloadableFile,
  TUserFileMetaData,
  TUserUploadedFile,
} from '@/@types/index.d.ts';

type UploadFileRequestBody = {
  /** Login of the file receiver. */
  receiver: string;
  /** Kind of the expire period. */
  expireAt: ExpirePeriod;
};

type UploadFileRequest = Request<object, object, UploadFileRequestBody>;

/**
 * Upload a file to the database.
 * @param req
 * @param res
 * @param next
 */
export const uploadFile = async (
  { body, user, file }: UploadFileRequest,
  res: Response<TUserUploadedFile>,
  next: NextFunction,
) => {
  const receiver = await UserModel.findOne({ login: body.receiver });
  if (!receiver) {
    return next(new APIError(404, 'RECEIVER_NOT_FOUND'));
  }

  if (receiver._id.equals(user!.id)) {
    return next(new APIError(400, 'SENDER_EQUALS_RECEIVER'));
  }

  if (await fileStorage.isUploadingFileUnique(user!.id, file!.originalname, receiver._id)) {
    return next(new APIError(400, 'DUPLICATE_FILE'));
  }

  const metadata = {
    mimetype: file!.mimetype,
    senderId: user!.id,
    receiverId: receiver._id,
    expireAt: createExpireDate(body.expireAt),
  } satisfies TUserFileMetaData;

  try {
    const uploadedFile = await fileStorage.saveFile(file!, metadata);
    return res.status(200).json(uploadedFile!);
  } catch {
    return next(new APIError(500, 'FILE_UPLOAD_FAILED'));
  }
};

type DownloadFileRequestQuery = {
  fileId: Types.ObjectId;
};

type DownloadFileRequest = Request<object, object, object, DownloadFileRequestQuery>;

/**
 * Download a file from the database.
 * @param req
 * @param res
 * @param next
 */
export const downloadFile = async (
  { user, query }: DownloadFileRequest,
  res: Response,
  next: NextFunction,
) => {
  const file = await fileStorage.getDownloadableFile(user!.id, new Types.ObjectId(query.fileId));
  if (!file) {
    return next(new APIError(404, 'FILE_NOT_FOUND'));
  }

  res.setHeader('Content-disposition', 'attachment;');
  res.setHeader('Content-type', file.metadata.mimetype);

  return fileStorage
    .getFileDownloadStream(file._id)
    .pipe(res)
    .on('finish', async () => {
      // Delete after download
      await fileStorage.deleteFile(file._id);
      res.status(200).end();
    })
    .on('error', () => next(new APIError(500, 'FILE_DOWNLOAD_FAILED')));
};

type DeleteFileRequestBody = {
  fileId: Types.ObjectId;
};

type DeleteFileRequest = Request<object, object, DeleteFileRequestBody>;

/**
 * Delete a file from the database.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const deleteFile = async ({ body, user }: DeleteFileRequest, res: Response, next: NextFunction) => {
  const { fileId } = body;

  const fileExistPromises = await Promise.all([
    fileStorage.isFileExistsInUploadedFiles(user!.id, fileId),
    fileStorage.isFileExistsInDownloadableFiles(user!.id, fileId),
  ]);

  if (!fileExistPromises.some(Boolean)) {
    return next(new APIError(404, 'FILE_NOT_FOUND'));
  }

  try {
    await fileStorage.deleteFile(fileId);
  } catch (error) {
    return next(new APIError(500, 'FILE_DELETE_FAILED'));
  }

  return res.status(200).end();
};

/**
 * Get all files uploaded by user.
 * @param req
 * @param res
 */
export const getUploadedFiles = async ({ user }: Request, res: Response<TUserUploadedFile[]>) => {
  const files = await fileStorage.getUploadedFiles(user!.id);

  return res.status(200).json(files);
};

/**
 * Get all downloadable by user files.
 * @param req
 * @param res
 */
export const getDownloadableFiles = async ({ user }: Request, res: Response<TUserDownloadableFile[]>) => {
  const files = await fileStorage.getDownloadableFiles(user!.id);

  return res.status(200).json(files);
};
