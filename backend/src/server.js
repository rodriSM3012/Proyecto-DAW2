import app from "./app.js";
import env from "./config/env.js";
import { verifyDatabaseConnection } from "./database/db.js";

async function startServer() {
  try {
    await verifyDatabaseConnection();
    app.listen(env.port, () => {
      console.log(`Backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
}

startServer();
