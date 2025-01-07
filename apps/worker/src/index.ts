import "dotenv/config";
import { transcodeVideo } from "./transcode";

transcodeVideo()
  .then(() => console.log("Success"))
  .catch((err) => console.error("Error:", err));
