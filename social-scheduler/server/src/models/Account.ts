import mongoose, { type Document, type Model, type Types } from "mongoose";

export const socialPlatforms = ["linkedin", "instagram", "facebook", "x"] as const;
export type SocialPlatform = (typeof socialPlatforms)[number];
export type AccountStatus = "connected" | "disconnected";

export interface AccountDocument extends Document {
    user: Types.ObjectId;
    platform: SocialPlatform;
    handle: string;
    platformAccountId: string;
    accessToken: string;
    refreshToken?: string;
    status: AccountStatus;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const accountSchema = new mongoose.Schema<AccountDocument>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        platform: { type: String, enum: socialPlatforms, required: true },
        handle: { type: String, required: true, trim: true },
        platformAccountId: { type: String, required: true, trim: true },
        accessToken: { type: String, required: true, select: false },
        refreshToken: { type: String, select: false },
        status: { type: String, enum: ["connected", "disconnected"], default: "connected" },
        avatarUrl: { type: String, trim: true },
    },
    { timestamps: true }
);

accountSchema.index({ user: 1, platform: 1, platformAccountId: 1 }, { unique: true });

export const Account: Model<AccountDocument> = mongoose.model<AccountDocument>("Account", accountSchema);
