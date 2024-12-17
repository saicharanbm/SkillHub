import express from "express";
import "dotenv/config";
import cors from "cors";
import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend domain
    credentials: true, // Enable credentials (cookies)
  })
);

app.use("/api/v1", router);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 3000}`
  );
});
