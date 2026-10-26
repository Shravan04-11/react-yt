import mongoose from "mongoose";

export async function connectDatabase(mongodbUri: string) {
    await mongoose.connect(mongodbUri);
    console.log("MongoDB connected");
}
