import "dotenv/config";

function getRequiredEnvironmentVariable(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export const env = {
    port: Number(process.env.PORT ?? 5000),
    mongodbUri: getRequiredEnvironmentVariable("MONGODB_URI"),
    clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
    jwtSecret: getRequiredEnvironmentVariable("JWT_SECRET"),
};
