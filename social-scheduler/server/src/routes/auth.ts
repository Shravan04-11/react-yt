import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User, type UserDocument } from "../models/User.js";

const router = Router();

function createToken(userId: string) {
    return jwt.sign({ userId }, env.jwtSecret, { expiresIn: "7d" });
}

function serializeUser(user: UserDocument) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        zeroProfileId: user.zeroProfileId,
    };
}

router.post("/register", async (request, response, next) => {
    try {
        const { name, email, password, zeroProfileId } = request.body as {
            name?: string;
            email?: string;
            password?: string;
            zeroProfileId?: string;
        };

        if (!name || !email || !password) {
            response.status(400).json({ message: "Name, email, and password are required" });
            return;
        }

        if (password.length < 8) {
            response.status(400).json({ message: "Password must be at least 8 characters" });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            response.status(409).json({ message: "An account with this email already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            zeroProfileId,
        });

        response.status(201).json({
            token: createToken(user.id),
            user: serializeUser(user),
        });
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (request, response, next) => {
    try {
        const { email, password } = request.body as { email?: string; password?: string };

        if (!email || !password) {
            response.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
        const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !passwordMatches) {
            response.status(401).json({ message: "Invalid email or password" });
            return;
        }

        response.json({
            token: createToken(user.id),
            user: serializeUser(user),
        });
    } catch (error) {
        next(error);
    }
});

export default router;
