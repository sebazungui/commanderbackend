import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: mongoose.Schema.Types.ObjectId },
});

export default mongoose.model('User', userSchema);