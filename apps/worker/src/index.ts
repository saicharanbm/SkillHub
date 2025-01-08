import "dotenv/config";
import { transcodeVideo } from "./transcode";
import { Kafka } from "kafkajs";
import fs from "fs";
import path from "path";

const tempDir = path.join(__dirname, "..", "temp");
fs.rmSync(tempDir, { recursive: true, force: true });

async function main() {
  const kafka = new Kafka({ brokers: ["localhost:9092"] });
  const consumer = kafka.consumer({ groupId: "video-transcoding-workers" });

  await consumer.connect();
  await consumer.subscribe({
    topic: "video-transcoding-jobs",
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) {
        throw Error("invalid data");
      }
      const data = JSON.parse(message.value.toString());
      console.log("topic: ", topic);
      console.log("partition: ", partition);
      console.log("data: ", data);
      try {
        console.log(`Processing video: ${data.videoId}`);
        await transcodeVideo(data); // Your transcoding logic
        console.log(`Successfully processed video: ${data.videoId}`);
      } catch (err) {
        console.error(`Failed to process video ${data.videoId}:`, err);
        // The message will remain uncommitted and be reprocessed
      }
    },
  });
}
main();
