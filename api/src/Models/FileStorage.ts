/** @fileoverview Wrapper for MongoDB GridFS. */

/* eslint-disable @typescript-eslint/indent */

import mongoose, { Types, mongo } from 'mongoose';
import { Readable } from 'stream';

import type { Collection } from 'mongodb';
import type {
  TUserDownloadableFile,
  TUserFile,
  TUserFileMetaData,
  TUserUploadedFile,
} from '@/@types/index.d.ts';

/** Wrapper for MongoDB GridFS. */
class FileStorage {
  private readonly COLLECTION_NAME: string = 'fs.files';

  private readonly DEFAULT_FILE_PROJECTION: Record<string, number> = {
    _id: 1,
    uploadDate: 1,
    filename: 1,
    'metadata.expireAt': 1,
    'metadata.mimetype': 1,
  };

  private readonly LOOKUP_FOR_FILE_RECEIVER: Record<string, unknown>[] = [
    {
      $lookup: {
        from: 'users',
        localField: 'metadata.receiverId',
        foreignField: '_id',
        as: 'receiver',
      },
    },
    {
      $unwind: '$receiver',
    },
  ];

  private readonly LOOKUP_FOR_FILE_SENDER: Record<string, unknown>[] = [
    {
      $lookup: {
        from: 'users',
        localField: 'metadata.senderId',
        foreignField: '_id',
        as: 'sender',
      },
    },
    {
      $unwind: '$sender',
    },
  ];

  private bucket!: InstanceType<typeof mongo.GridFSBucket>;

  private collection!: Collection<TUserFile>;

  /**
   * Connect to the Mongo DB.
   */
  public async connect() {
    const { db } = mongoose.connection;

    this.bucket = new mongo.GridFSBucket(db);
    this.collection = db.collection<TUserFile>(this.COLLECTION_NAME);

    // Create index on "metadata.expireAt" for auto delete document after certain time
    await this.collection.createIndex({ 'metadata.expireAt': 1 }, { expireAfterSeconds: 0 });
  }

  /**
   * Is the uploading file exists with certain filename and receiver id.
   * @param userId
   * @param filename
   * @param receiverId
   */
  public async isUploadingFileUnique(userId: Types.ObjectId, filename: string, receiverId: Types.ObjectId) {
    const file = await this.collection.findOne({
      filename,
      'metadata.senderId': userId,
      'metadata.receiverId': receiverId,
    });

    return !!file;
  }

  /**
   * Is the file exist in the user's available files for downloading.
   * @param userId
   * @param fileId
   * @returns
   */
  public async isFileExistsInDownloadableFiles(userId: Types.ObjectId, fileId: Types.ObjectId) {
    const file = await this.collection.findOne({
      _id: fileId,
      'metadata.receiverId': userId,
    });

    return !!file;
  }

  /**
   * Is the file exist in the files uploaded by user.
   * @param userId
   * @param fileId
   * @returns
   */
  public async isFileExistsInUploadedFiles(userId: Types.ObjectId, fileId: Types.ObjectId) {
    const file = await this.collection.findOne({
      _id: fileId,
      'metadata.senderId': userId,
    });

    return !!file;
  }

  /**
   * Save the file to GridFS.
   * @param file
   * @param metadata
   * @returns
   */
  public saveFile(
    { buffer, originalname }: Express.Multer.File,
    metadata: TUserFileMetaData,
  ): Promise<TUserUploadedFile | null> {
    return new Promise((resolve, reject) => {
      const uploadStream = Readable.from(buffer).pipe(
        this.bucket.openUploadStream(originalname, { metadata }),
      );

      uploadStream
        .on('finish', () => this.getUploadedFile(uploadStream.id as Types.ObjectId).then(resolve))
        .on('error', reject);
    });
  }

  /**
   * Get a certain file from the user's available files for downloading.
   * @param userId
   * @param fileId
   * @returns
   */
  public async getDownloadableFile(userId: Types.ObjectId, fileId: Types.ObjectId) {
    return this.collection.findOne({
      _id: fileId,
      'metadata.receiverId': userId,
    });
  }

  /**
   * Get the download stream of certain file
   * @param fileId
   */
  public getFileDownloadStream(fileId: Types.ObjectId) {
    return this.bucket.openDownloadStream(fileId);
  }

  /**
   * Get a data about the certain uploaded file.
   * @param fileId
   */
  public async getUploadedFile(fileId: Types.ObjectId) {
    return this.collection
      .aggregate<TUserUploadedFile>([
        {
          $match: { _id: fileId },
        },
        ...this.LOOKUP_FOR_FILE_RECEIVER,
        {
          $project: {
            ...this.DEFAULT_FILE_PROJECTION,
            'receiver.login': 1,
          },
        },
      ])
      .next();
  }

  /**
   * Get a data about the all files uploaded by user.
   * @param userId
   */
  public async getUploadedFiles(userId: Types.ObjectId) {
    return this.collection
      .aggregate<TUserUploadedFile>([
        {
          $match: { 'metadata.senderId': userId },
        },
        ...this.LOOKUP_FOR_FILE_RECEIVER,
        {
          $project: {
            ...this.DEFAULT_FILE_PROJECTION,
            'receiver.login': 1,
          },
        },
      ])
      .toArray();
  }

  /**
   * Get a data about the all downloadable files by user.
   * @param userId
   */
  public async getDownloadableFiles(userId: Types.ObjectId) {
    return this.collection
      .aggregate<TUserDownloadableFile>([
        {
          $match: { 'metadata.receiverId': userId },
        },
        ...this.LOOKUP_FOR_FILE_SENDER,
        {
          $project: {
            ...this.DEFAULT_FILE_PROJECTION,
            'sender.login': 1,
          },
        },
      ])
      .toArray();
  }

  /**
   * Delete the certain file.
   * @param fileId
   */
  public async deleteFile(fileId: Types.ObjectId) {
    return this.bucket.delete(fileId);
  }
}

export const fileStorage = new FileStorage();
