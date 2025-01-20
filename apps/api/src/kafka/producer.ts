import { Kafka } from "kafkajs";
interface VideoJob {
  videoId: string;
  source: string;
  destination: string;
  attempts?: number;
  maxAttempts?: number;
  status?: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

const KAFKA_TOPICS = {
  JOBS: "video-transcoding-jobs",
  STATUS: "video-transcoding-status",
  DLQ: "video-transcoding-dlq",
};
export class VideoJobProducer {
  private producer;

  constructor(brokers: string[]) {
    const kafka = new Kafka({ brokers });
    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
  }

  async sendVideoJob(
    data: Pick<VideoJob, "videoId" | "source" | "destination">
  ) {
    const job: VideoJob = {
      ...data,
      attempts: 0,
      maxAttempts: 3,
      status: "pending",
    };

    await this.producer.send({
      topic: KAFKA_TOPICS.JOBS,
      messages: [
        {
          key: data.videoId,
          value: JSON.stringify(job),
        },
      ],
    });

    return job;
  }
}
