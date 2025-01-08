import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: ["localhost:9092"] });

export const producer = kafka.producer();

export async function connectToKafkaProducer() {
  await producer.connect();
}

export async function sendVideosToKafka(data: {
  videoId: string;
  source: string;
  destination: string;
}) {
  await producer.send({
    topic: "video-transcoding-jobs",
    messages: [{ value: JSON.stringify(data) }],
  });
}
