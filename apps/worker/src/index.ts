import "dotenv/config";
import { VideoJobWorker } from "./redis/consumer";

// Start the worker
const worker = new VideoJobWorker(process.env.REDIS_CONNECTION_URL as string);
worker.start();
