import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";

interface VideoJob {
  id: string;
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
    await this.redisClient
      .xGroupCreate(REDIS_STREAM, "video-consumer-group", "$", {
        MKSTREAM: true,
      })
      .catch((err) => {
        if (!err.message.includes("BUSYGROUP")) {
          console.error("Error creating consumer group:", err.message);
        }
      });
  }

  async disconnect() {
    await this.redisClient.disconnect();
  }

  async addJob(videoId: string, source: string, destination: string) {
    const job: VideoJob = {
      id: uuidv4(),
      videoId,
      source,
      destination,
      status: "pending",
    };

    await this.redisClient.xAdd(REDIS_STREAM, "*", {
      id: job.id,
      videoId: job.videoId,
      source: job.source,
      destination: job.destination,
      status: job.status,
    });
    console.log("job added : ", job);

    return job;
  }
}
