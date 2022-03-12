import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    login: String,
    email: String,
    password: String,
});

export default mongoose.model('User', userSchema);
