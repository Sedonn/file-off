import mongoose, { Types } from 'mongoose';
import streamifier from 'streamifier';

import { ObjectId as BSONObjectId } from 'bson';
import { FileMetadata, FileRecord } from '../@types/file-off';

// Wrapper for MongoDB GridFS.
class FileStorage {
    private readonly _COLLECTION_NAME: string = 'fs.files';

    private _db;

    private _bucket;

    private _collection;

    constructor() {
        this._db = mongoose.connection.db;
        this._bucket = new mongoose.mongo.GridFSBucket(this._db);
        this._collection = this._db.collection<FileRecord>(this._COLLECTION_NAME);

        // Creating index on "metadata.expireAt" for auto delete document after specific time.
        this._collection.createIndex({ 'metadata.expireAt': 1 }, { expireAfterSeconds: 0 });
    }

    /**
     * Function for writing file to MongoDB.
     * @param {Express.Multer.File} file - File object.
     * @param {FileMetadata} metadata - File metadata object.
     * @returns {GridFSBucketWriteStream} - GridFS bucket write stream.
     */
    public writeFile(file: Express.Multer.File, metadata: FileMetadata) {
        return streamifier
            .createReadStream(file.buffer)
            .pipe(this._bucket.openUploadStream(file.originalname, { metadata }));
    }

    /**
     * Function for finding file with specific name and receiver ID.
     * @param {Types.ObjectId} receiverId - Receiver ID.
     * @param {string} filename - File name.
     * @returns {Promise<WithId<FileRecord>} - Result of find.
     */
    public async getFileByReceiver(receiverId: Types.ObjectId, filename: string) {
        return this._collection.findOne({
            $and: [{ filename }, { 'metadata.receiverId': receiverId }],
        });
    }

    /**
     *  Function for finding file with specific name, recieverId and receiver ID.
     * @param {Types.ObjectId} senderId - Sender ID.
     * @param {string} filename - File name.
     * @param {Types.ObjectId} receiverId - Receiver ID.
     * @returns {Promise<WithId<FileRecord>} - Result of find.
     */
    public async getFileBySender(senderId: Types.ObjectId, filename: string, receiverId: Types.ObjectId) {
        return this._collection.findOne({
            $and: [{ filename }, { 'metadata.senderId': senderId }, { 'metadata.receiverId': receiverId }],
        });
    }

    /**
     * Function for getting the download stream of specific file.
     * @param {BSONObjectId} fileId - File ID.
     * @returns {GridFSBucketReadStream} - GridFS bucket read stream.
     */
    public getFileDownloadStream(fileId: BSONObjectId) {
        return this._bucket.openDownloadStream(fileId);
    }

    /**
     * Function for getting the file data of recently loaded file.
     * @param {BSONObjectId} fileId - File ID.
     * @returns - File data.
     */
    public async getUploadData(fileId: BSONObjectId) {
        return this._collection
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
                    $match: { _id: fileId },
                },
                {
                    $unwind: '$receiverData',
                },
                {
                    $project: {
                        _id: 0,
                        uploadDate: 1,
                        filename: 1,
                        'receiverData.login': 1,
                        'metadata.expireAt': 1,
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
    public async getUploadFiles(userId: Types.ObjectId) {
        return this._collection
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
                    $match: { 'metadata.senderId': userId },
                },
                {
                    $unwind: '$receiverData',
                },
                {
                    $project: {
                        _id: 0,
                        uploadDate: 1,
                        filename: 1,
                        'receiverData.login': 1,
                        'metadata.expireAt': 1,
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
    public async getDownloadFiles(userId: Types.ObjectId) {
        return this._collection
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
                    $match: { 'metadata.receiverId': userId },
                },
                {
                    $unwind: '$senderData',
                },
                {
                    $project: {
                        _id: 0,
                        uploadDate: 1,
                        filename: 1,
                        'senderData.login': 1,
                        'metadata.expireAt': 1,
                    },
                },
            ])
            .toArray();
    }

    /**
     * Function for deleting file.
     * @param {BSONObjectId} fileId - File ID.
     */
    public async deleteFile(fileId: BSONObjectId) {
        this._bucket.delete(fileId);
    }
}

export default FileStorage;
