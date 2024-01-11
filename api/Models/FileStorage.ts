import mongoose, { Types } from 'mongoose';
import { Readable } from 'stream';

import { TUserDownloadableFile, TUserFile, TUserFileMetaData, TUserUploadedFile } from '../@types';

/** Wrapper for MongoDB GridFS. */
class FileStorage {
  private readonly _COLLECTION_NAME: string = 'fs.files';

  private readonly _DEFAULT_FILE_PROJECTION: Record<keyof TUserFile | string, number> = {
    _id: 1,
    uploadDate: 1,
    filename: 1,
    'metadata.expireAt': 1,
    'metadata.mimetype': 1,
  };

  private readonly _LOOKUP_FOR_FILE_RECEIVER: Record<string, any>[] = [
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

  private readonly _LOOKUP_FOR_FILE_SENDER: Record<string, any>[] = [
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

  private _bucket;

  private _collection;

  constructor() {
    const { db } = mongoose.connection;

    this._bucket = new mongoose.mongo.GridFSBucket(db);
    this._collection = db.collection<TUserFile>(this._COLLECTION_NAME);

    // Creating index on "metadata.expireAt" for auto delete document after certain time
    this._collection.createIndex({ 'metadata.expireAt': 1 }, { expireAfterSeconds: 0 });
  }

  /**
   * Is the file exists with certain filename and receiver id.
   * @param userId
   * @param filename
   * @param receiverId
   */
  public async isUploadingFileUnique(userId: Types.ObjectId, filename: string, receiverId: Types.ObjectId) {
    const file = await this._collection.findOne({
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
    const file = await this._collection.findOne({
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
    const file = await this._collection.findOne({
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
        this._bucket.openUploadStream(originalname, { metadata }),
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
    return this._collection.findOne({
      _id: fileId,
      'metadata.receiverId': userId,
    });
  }

  /**
   * Function for getting the download stream of certain file.
   * @param {Types.ObjectId} fileId - File ID.
   */
  public getFileDownloadStream(fileId: Types.ObjectId) {
    return this._bucket.openDownloadStream(fileId);
  }

  /**
   * Function for getting the file data of recently loaded file.
   * @param {Types.ObjectId} fileId - File ID.
   */
  public async getUploadedFile(fileId: Types.ObjectId) {
    return this._collection
      .aggregate<TUserUploadedFile>([
        {
          $match: { _id: fileId },
        },
        ...this._LOOKUP_FOR_FILE_RECEIVER,
        {
          $project: {
            ...this._DEFAULT_FILE_PROJECTION,
            'receiver.login': 1,
          },
        },
      ])
      .next();
  }

  /**
   * Function for getting all uploaded by user files.
   * @param {Types.ObjectId} userId - User ID.
   * @returns - All uploaded by user files.
   */
  public async getUploadedFiles(userId: Types.ObjectId) {
    return this._collection
      .aggregate<TUserUploadedFile>([
        {
          $match: { 'metadata.senderId': userId },
        },
        ...this._LOOKUP_FOR_FILE_RECEIVER,
        {
          $project: {
            ...this._DEFAULT_FILE_PROJECTION,
            'receiver.login': 1,
          },
        },
      ])
      .toArray();
  }

  /**
   * Function for getting all available to download files by user.
   * @param {Types.ObjectId} userId - User ID.
   * @returns - All available to download files by user.
   */
  public async getDownloadableFiles(userId: Types.ObjectId) {
    return this._collection
      .aggregate<TUserDownloadableFile>([
        {
          $match: { 'metadata.receiverId': userId },
        },
        ...this._LOOKUP_FOR_FILE_SENDER,
        {
          $project: {
            ...this._DEFAULT_FILE_PROJECTION,
            'sender.login': 1,
          },
        },
      ])
      .toArray();
  }

  /**
   * Function for deleting file.
   * @param {Types.ObjectId} fileId - File ID.
   */
  public async deleteFile(fileId: Types.ObjectId) {
    return this._bucket.delete(fileId);
  }
}

export default FileStorage;
