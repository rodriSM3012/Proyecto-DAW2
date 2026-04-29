const { app } = require("./app").default;
const { env } = require("./config/env");
const { verifyDatabaseConnection } = require("./database/db");

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
