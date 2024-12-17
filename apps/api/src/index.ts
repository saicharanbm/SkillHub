import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend domain
    credentials: true, // Enable credentials (cookies)
  })
);
