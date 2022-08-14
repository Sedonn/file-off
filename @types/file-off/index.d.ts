import mongoose from 'mongoose';

interface FileMetadata {
    mimetype: string;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
}

interface ErrorMessage {
    error: Array<string>;
}

interface ResultMessage {
    message: string;
}