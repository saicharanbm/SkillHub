import { createClient } from "redis";
import { transcodeVideo } from "../services/transcode";

const REDIS_STREAM = "video-transcoding-jobs";
const GROUP_NAME = "transcoding-group";
const CONSUMER_NAME = `worker-${Math.random().toString(36).substring(7)}`;

export class VideoJobWorker {
  private redis;
  private isRunning: boolean = true;

  constructor(redisUrl: string) {
    this.redis = createClient({ url: redisUrl });
    this.redis.connect();
  }

  async start() {
    try {
      // Ensure the consumer group exists (ignore error if it already exists)
      await this.redis
        .xGroupCreate(REDIS_STREAM, GROUP_NAME, "0", { MKSTREAM: true })
        .catch((err) => {
          if (!err.message.includes("BUSYGROUP")) {
            console.error("Error creating consumer group:", err.message);
          }
        });

      console.log(`${CONSUMER_NAME} started...`);

      while (this.isRunning) {
        await this.processPendingJobs();
        await this.processNewJobs();
      }
    } catch (err) {
      console.error("Error in worker:", err);
    }
  }

  async processPendingJobs() {
    try {
      const pending = await this.redis.xPending(REDIS_STREAM, GROUP_NAME);
      if (pending.pending > 0) {
        console.log("Reclaiming unacknowledged jobs...");

        const pendingMessages = await this.redis.xPendingRange(
          REDIS_STREAM,
          GROUP_NAME,
          "-",
          "+",
          pending.pending
        );

        const jobs = await this.redis.xClaim(
          REDIS_STREAM,
          GROUP_NAME,
          CONSUMER_NAME,
          60000,
          pendingMessages.map((m) => m.id)
        );

        for (const job of jobs) {
          if (job) {
            const { id, message } = job;
            console.log("pending video job :", message);

            await this.handleJob(id, message);
          }
        }
      }
    } catch (error) {
      console.error("Error reclaiming jobs:", error);
    }
  }

  async processNewJobs() {
    try {
      const result = await this.redis.xReadGroup(
        GROUP_NAME,
        CONSUMER_NAME,
        [{ key: REDIS_STREAM, id: ">" }],
        {
          COUNT: 1,
          BLOCK: 5000, // Wait for new jobs
        }
      );

      if (result) {
        for (const stream of result) {
          for (const message of stream.messages) {
            await this.handleJob(message.id, message.message);
          }
        }
      }
    } catch (err) {
      console.error("Error reading from stream:", err);
    }
  }

  async handleJob(jobId: string, job: Record<string, string>) {
    try {
      console.log("processing job :", job.source);
      // const job = JSON.parse(jobData.data);

      console.log(`Processing job: ${job.videoId}`);
      job.status = "processing";
      await this.redis.set(`video_status:${job.videoId}`, JSON.stringify(job));

      // Simulate video transcoding work
      // await new Promise((res) => setTimeout(res, 5000));
      const data = {
        videoId: job.videoId,
        source: job.source,
        destination: job.destination,
      };
      await transcodeVideo(data);

      job.status = "completed"; // or "failed" based on actual processing result
      console.log(`Job completed: ${job.videoId}`);

      await this.redis.set(`video_status:${job.videoId}`, JSON.stringify(job));
      await this.redis.xAck(REDIS_STREAM, GROUP_NAME, job.id);
    } catch (error) {
      console.error(`Error processing job ${job.videoId}:`, error);
    }
  }

  async stop() {
    this.isRunning = false;
    await this.redis.disconnect();
  }
}
