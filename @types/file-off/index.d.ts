import { Types } from 'mongoose';

interface FileMetadata {
    mimetype: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
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
