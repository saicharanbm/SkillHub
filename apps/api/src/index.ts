import express from "express";
import "dotenv/config";
import cors from "cors";
import { router } from "./routes";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import { VideoJobProducer } from "./redis/producer";

const app = express();
const requiredEnvVars = [
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "REDIS_CONNECTION_URL",
  "PORT",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});
app.use(cookieParser());
export const producer = new VideoJobProducer(
  process.env.REDIS_CONNECTION_URL as string
);
async function startServer() {
  await producer.connect();

  process.on("SIGTERM", async () => {
    await producer.disconnect();
    process.exit(0);
  });
  app.use(express.json());

  app.use(
    cors({
      origin: (origin, callback) => {
        console.log("Origin : ", origin);
        //for the dev environment i am allowing all the ports of localhost to access the api server
        if (
          !origin ||
          origin.startsWith("http://localhost:") ||
          origin === "https://creator.skillhub.saicharanbm.in" ||
          origin === "https://skillhub.saicharanbm.in"
        ) {
          // Allow if origin is from localhost with any port or production url.
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS")); // Block other origins
        }
      },
      credentials: true, // Enable credentials (cookies)
    })
  );

  app.use("/api/v1", router);

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}

startServer();
