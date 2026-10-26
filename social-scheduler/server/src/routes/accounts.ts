import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Account, socialPlatforms, type AccountDocument, type SocialPlatform } from "../models/Account.js";

const router = Router();
router.use(requireAuth);

function isSocialPlatform(value: unknown): value is SocialPlatform {
    return typeof value === "string" && socialPlatforms.includes(value as SocialPlatform);
}

function serializeAccount(account: AccountDocument) {
    return {
        id: account._id.toString(),
        platform: account.platform,
        handle: account.handle,
        platformAccountId: account.platformAccountId,
        status: account.status,
        avatarUrl: account.avatarUrl,
    };
}

router.get("/", async (request, response, next) => {
    try {
        if (!request.userId) {
            response.status(401).json({ message: "Authentication required" });
            return;
        }

        const accounts = await Account.find({ user: request.userId }).sort({ createdAt: -1 });
        response.json({ accounts: accounts.map((account) => serializeAccount(account)) });
    } catch (error) {
        next(error);
    }
});

router.post("/", async (request, response, next) => {
    try {
        if (!request.userId) {
            response.status(401).json({ message: "Authentication required" });
            return;
        }

        const { platform, handle, platformAccountId, accessToken, refreshToken, avatarUrl } = request.body as {
            platform?: unknown;
            handle?: string;
            platformAccountId?: string;
            accessToken?: string;
            refreshToken?: string;
            avatarUrl?: string;
        };

        if (!isSocialPlatform(platform) || !handle || !platformAccountId || !accessToken) {
            response.status(400).json({
                message: "Platform, handle, platformAccountId, and accessToken are required",
            });
            return;
        }

        const account = await Account.create({
            user: request.userId,
            platform,
            handle: handle.trim(),
            platformAccountId: platformAccountId.trim(),
            accessToken,
            refreshToken,
            avatarUrl,
        });

        response.status(201).json({ account: serializeAccount(account) });
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (request, response, next) => {
    try {
        if (!request.userId) {
            response.status(401).json({ message: "Authentication required" });
            return;
        }

        const account = await Account.findOneAndDelete({ _id: request.params.id, user: request.userId });

        if (!account) {
            response.status(404).json({ message: "Account not found" });
            return;
        }

        response.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
