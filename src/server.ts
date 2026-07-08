import app from "./app";
import dotenv from "dotenv";
// import { prisma } from "./lib/prisma";
// import config from "./config";

dotenv.config();

const PORT = 5000; // config.port || 5000;

async function main() {
  try {
    // await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    // await prisma.$disconnect();
    process.exit(1);
  }
}

main();
