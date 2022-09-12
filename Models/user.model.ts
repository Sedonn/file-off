import mongoose from 'mongoose';

// Creating the user Schema
const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    login: String,
    email: String,
    password: String,
});

export default mongoose.model('User', userSchema);
