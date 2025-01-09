// worker-service/src/kafka/consumer.ts
// import { Kafka, Consumer, KafkaMessage } from "kafkajs";
// import { transcodeVideo } from "../services/transcode";

import { Kafka, Consumer, KafkaMessage, ConsumerConfig } from "kafkajs";
import { transcodeVideo } from "../services/transcode";

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

export class VideoConsumer {
  private consumer: Consumer;
  private isRunning = false;
  private readonly sessionTimeout = 30000; // 30 seconds
  private readonly heartbeatInterval = 3000; // 3 seconds

  constructor(brokers: string[], groupId: string) {
    const kafka = new Kafka({
      brokers,
      clientId: `video-worker-${Date.now()}`, // Unique client ID
    });

    const consumerConfig: ConsumerConfig = {
      groupId,
      sessionTimeout: this.sessionTimeout,
      heartbeatInterval: this.heartbeatInterval,
      maxBytes: 5242880, // 5MB
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    };

    this.consumer = kafka.consumer(consumerConfig);
  }

  async start() {
    try {
      await this.consumer.connect();

      await this.consumer.subscribe({
        topic: "video-transcoding-jobs",
        fromBeginning: false,
      });

      this.isRunning = true;

      await this.consumer.run({
        autoCommit: false, // Disable auto commit
        partitionsConsumedConcurrently: 1, // Process one partition at a time
        eachMessage: async ({ topic, partition, message }) => {
          try {
            if (!message.value) return;

            const data = JSON.parse(message.value.toString());
            console.log(`Processing video: ${data.videoId}`);

            await this.processVideo(data);

            // Commit offset after successful processing
            try {
              await this.consumer.commitOffsets([
                {
                  topic,
                  partition,
                  offset: (BigInt(message.offset) + BigInt(1)).toString(),
                },
              ]);
            } catch (commitError: any) {
              if (
                commitError.type === "UNKNOWN_MEMBER_ID" ||
                commitError.type === "REBALANCE_IN_PROGRESS"
              ) {
                console.log(
                  "Commit failed due to rebalancing, message will be reprocessed"
                );
                return;
              }
              throw commitError;
            }
          } catch (error) {
            console.error("Error processing message:", error);
            // Don't throw error here, let the consumer continue
          }
        },
      });

      // Handle consumer group errors
      this.consumer.on(this.consumer.events.GROUP_JOIN, ({ payload }) => {
        console.log("Consumer joined group:", payload);
      });

      this.consumer.on(
        this.consumer.events.CRASH,
        async ({ payload: { error } }) => {
          console.error("Consumer crashed:", error);
          if (this.isRunning) {
            console.log("Attempting to restart consumer...");
            await this.reconnect();
          }
        }
      );

      this.consumer.on(this.consumer.events.DISCONNECT, async () => {
        if (this.isRunning) {
          console.log("Consumer disconnected, attempting to reconnect...");
          await this.reconnect();
        }
      });
    } catch (error) {
      console.error("Failed to start consumer:", error);
      throw error;
    }
  }

  private async reconnect(retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
      try {
        if (!this.isRunning) {
          await this.consumer.connect();
          await this.consumer.subscribe({
            topic: "video-transcoding-jobs",
            fromBeginning: false,
          });
          await this.consumer.run({
            autoCommit: false,
            partitionsConsumedConcurrently: 1,
            eachMessage: async ({ topic, partition, message }) => {
              // ... same message handling logic as above
            },
          });
        }
        console.log("Successfully reconnected");
        return;
      } catch (error) {
        console.error(`Reconnection attempt ${i + 1} failed:`, error);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    console.error("Failed to reconnect after multiple attempts");
  }

  private async processVideo(data: any) {
    try {
      await transcodeVideo(data);
      console.log(`Successfully processed video: ${data.videoId}`);
    } catch (error) {
      console.error(`Failed to process video ${data.videoId}:`, error);
      throw error;
    }
  }

  async stop() {
    this.isRunning = false;
    try {
      await this.consumer.disconnect();
    } catch (error) {
      console.error("Error disconnecting consumer:", error);
    }
  }
}
