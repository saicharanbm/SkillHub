import "dotenv/config";
import { transcodeVideo } from "./transcode";
import fs from "fs";
import path from "path";

const tempDir = path.join(__dirname, "..", "temp");
fs.rmSync(tempDir, { recursive: true, force: true });

transcodeVideo()
  .then(() => console.log("Success"))
  .catch((err) => console.error("Error:", err));
