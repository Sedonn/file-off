import { Types } from 'mongoose';

interface FileMetadata {
    mimetype: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    expireAt: Date
}

interface FileRecord {
    length: number;
    chunkSize: number;
    uploadDate: Date;
    filename: string;
    metadata: FileMetadata;
}

interface ErrorMessage {
    error: Array<string>;
}

interface ResultMessage {
    message: string;
}

interface ExpirePeriods {
    year(): Date,
    month(): Date,
    week(): Date,
}