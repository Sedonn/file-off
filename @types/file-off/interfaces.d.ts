import mongoose from 'mongoose';

interface FileMetadata {
    mimetype: String;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
}
