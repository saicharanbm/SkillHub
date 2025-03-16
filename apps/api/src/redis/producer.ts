import { createClient } from "redis";
interface VideoJob {
  videoId: string;
  source: string;
  destination: string;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

const REDIS_STREAM = "video-transcoding-jobs";

export class VideoJobProducer {
  private redisClient;

  constructor(redisUrl: string) {
    this.redisClient = createClient({ url: redisUrl });
  }

  async connect() {
    await this.redisClient.connect();
    console.log("Redis client connected.");
  }

  async disconnect() {
    await this.redisClient.disconnect();
    console.log("Redis client disconnected.");
  }

  async addJob(videoId: string, source: string, destination: string) {
    const job: VideoJob = {
      videoId,
      source,
      destination,
      status: "pending",
    };

    await this.redisClient.xAdd(REDIS_STREAM, "*", {
      videoId: job.videoId,
      source: job.source,
      destination: job.destination,
      status: job.status,
    });
    console.log("job added : ", job);

    return job;
  }
}
