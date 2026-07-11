import app from "./app";
import dotenv from "dotenv";
import config from "./config";
import { prisma } from "./lib/prisma";

dotenv.config();

const PORT =  config.port || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
