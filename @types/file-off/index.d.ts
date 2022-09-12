import { Types } from 'mongoose';

/**
 * Interface, describing the file metadata.
 */
interface FileMetadata {
    mimetype: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    expireAt: Date;
}

/**
 * Interface, describing the file record which getting from database.
 */
interface FileRecord {
    length: number;
    chunkSize: number;
    uploadDate: Date;
    filename: string;
    metadata: FileMetadata;
}

/**
 * Interface, describing the error message.
 */
interface ErrorMessage {
    error: Array<string>;
}

/**
 * Interface, describing the result message.
 */
interface ResultMessage {
    message: string;
}

/**
 * Interface, describing the available expire periods.
 */
interface ExpirePeriods {
    year(): Date;
    month(): Date;
    week(): Date;
}
