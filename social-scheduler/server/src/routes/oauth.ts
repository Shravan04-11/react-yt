import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { socialPlatforms } from "../models/Account.js";

const router = Router();
router.use(requireAuth);

router.get("/:platform/url", (request, response) => {
    const { platform } = request.params;

    if (!socialPlatforms.includes(platform as (typeof socialPlatforms)[number])) {
        response.status(400).json({ message: "Unsupported social platform" });
        return;
    }

    response.status(501).json({
        message: "OAuth provider credentials are not configured yet",
        platform,
    });
});

router.get("/sync", (_request, response) => {
    response.status(501).json({
        message: "Social account sync will be enabled after the provider API credentials are configured",
    });
});

export default router;
