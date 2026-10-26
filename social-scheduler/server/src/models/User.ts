import mongoose, { type Document, type Model } from "mongoose";

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    zeroProfileId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 8, select: false },
        zeroProfileId: { type: String, trim: true },
    },
    { timestamps: true }
);

export const User: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);
