import "dotenv/config";
import { VideoJobWorker } from "./redis/consumer";

// Start the worker
const worker = new VideoJobWorker("redis://localhost:6379");
worker.start();
