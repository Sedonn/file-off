import mongoose from 'mongoose';

interface FileMetadata {
    mimetype: string;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
}