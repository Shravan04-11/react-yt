import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
    await connectDatabase(env.mongodbUri);

    app.listen(env.port, () => {
        console.log(`API server running on http://localhost:${env.port}`);
    });
}

startServer().catch((error: unknown) => {
    console.error("Failed to start API server", error);
    process.exit(1);
});
