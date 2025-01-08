import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: ["localhost:9092"] });

export const producer = kafka.producer();
// export const connectToKafkaProducer = async()=>{
//     await producer.connect();
// }
producer.connect();

export async function sendVideosToKafka(data: {
  id: string;
  source: string;
  destination: string;
}) {
  await producer.send({
    topic: "video-transcoding-jobs",
    messages: [{ value: JSON.stringify(data) }],
  });
}

producer.connect();
