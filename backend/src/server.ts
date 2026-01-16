import app from "./app";
import { connectDB } from "./config/db";
import { config } from "./config/env";

const PORT = config.port;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  });
};

startServer();
