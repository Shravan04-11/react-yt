import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import accountsRouter from "./routes/accounts.js";
import authRouter from "./routes/auth.js";
import oauthRouter from "./routes/oauth.js";

export const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/oauth", oauthRouter);

app.get("/api/health", (_request, response) => {
    response.json({ status: "ok", service: "social-scheduler-api" });
});

app.use(errorHandler);
