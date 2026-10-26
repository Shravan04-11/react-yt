import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

interface AuthTokenPayload extends JwtPayload {
    userId: string;
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
    const authorization = request.header("Authorization");
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;

    if (!token) {
        response.status(401).json({ message: "Authentication token is required" });
        return;
    }

    try {
        const payload = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;

        if (!payload.userId) {
            response.status(401).json({ message: "Invalid authentication token" });
            return;
        }

        request.userId = payload.userId;
        next();
    } catch {
        response.status(401).json({ message: "Invalid or expired authentication token" });
    }
}
