import "dotenv/config";
import fs from "fs";
import path from "path";

const tempDir = path.join(__dirname, "..", "temp");
fs.rmSync(tempDir, { recursive: true, force: true });

import { VideoConsumer } from "./kafka/consumer";

async function main() {
  const consumer = new VideoConsumer(
    ["localhost:9092"],
    "video-transcoding-worker"
  );

  // Handle graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("Received SIGTERM, shutting down...");
    await consumer.stop();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.log("Received SIGINT, shutting down...");
    await consumer.stop();
    process.exit(0);
  });

  try {
    await consumer.start();
  } catch (error) {
    console.error("Failed to start consumer:", error);
    process.exit(1);
  }
}

main().catch(console.error);
