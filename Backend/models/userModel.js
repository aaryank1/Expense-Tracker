import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
});

const userModel = mongoose.model.users || mongoose.model("users", userSchema);

export default userModel;