import app from "./app";
import dotenv from "dotenv";
import { connectMongoDB } from "./shared/infrastructure/database/MongoConnection";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. Initialize MongoDB
    await connectMongoDB();

    // 2. Start the express app
    app.listen(PORT, () => {
      console.log(`Server ready at: http://localhost:${PORT}`);
      console.log(`Docs available at: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
