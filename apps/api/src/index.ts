import express from "express";
import "dotenv/config";
import cors from "cors";
import { router } from "./routes";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";

const app = express();
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
app.use(cookieParser());

app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Frontend domain
//     credentials: true, // Enable credentials (cookies)
//   })
// );
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin : ", origin);
      //for the dev environment i am allowing all the ports of localhost to access the api server
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        // Allow if origin is from localhost with any port
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
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 3000}`
  );
});
