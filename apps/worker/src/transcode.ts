import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
// import os from "os";
import { Readable } from "stream";
import { finished } from "stream/promises";

if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_REGION ||
  !process.env.BUCKET_NAME
) {
  throw new Error("AWS credentials not found");
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.BUCKET_NAME;
const inputKey = "test/raw/videoplayback.mp4";
const outputKeyPrefix = "test/processed/";

async function uploadToS3(bucket: string, key: string, body: Buffer | string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
  });
  return s3.send(command);
}

async function downloadFromS3ToLocal(
  bucket: string,
  key: string,
  localPath: string
): Promise<void> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3.send(command);
  const writeStream = fs.createWriteStream(localPath);
  await finished(Readable.from(response.Body as Readable).pipe(writeStream));
}

async function processResolution(
  resolution: {
    name: string;
    width: number;
    bitrate: string;
    audioBitrate: string;
  },
  tempDir: string,
  inputFilePath: string
): Promise<void> {
  console.log(`Processing ${resolution.name} resolution...`);

  await new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .outputOptions([
        "-vf",
        `scale=${resolution.width}:-2`, // Maintain aspect ratio
        "-c:v",
        "h264",
        "-b:v",
        resolution.bitrate,
        "-c:a",
        "aac",
        "-b:a",
        resolution.audioBitrate,
        "-hls_time",
        "10",
        "-hls_playlist_type",
        "vod",
        "-hls_segment_filename",
        path.join(tempDir, `${resolution.name}_%03d.ts`),
      ])
      .output(path.join(tempDir, `${resolution.name}.m3u8`))
      .on("progress", (progress) => {
        console.log(
          `[${resolution.name}] Processing: ${progress.percent?.toFixed(2)}%`
        );
      })
      .on("end", () => {
        console.log(`[${resolution.name}] Processing completed`);
        resolve(null);
      })
      .on("error", (err) => {
        console.error(`[${resolution.name}] Processing error:`, err);
        reject(err);
      })
      .run();
  });

  console.log(`Uploading ${resolution.name} files to S3...`);

  // Upload playlist file
  const playlistContent = fs.readFileSync(
    path.join(tempDir, `${resolution.name}.m3u8`)
  );
  await uploadToS3(
    bucketName,
    `${outputKeyPrefix}${resolution.name}.m3u8`,
    playlistContent
  );

  // Upload all segment files
  const files = fs.readdirSync(tempDir);
  for (const file of files) {
    if (file.startsWith(resolution.name) && file.endsWith(".ts")) {
      const segmentContent = fs.readFileSync(path.join(tempDir, file));
      await uploadToS3(bucketName, `${outputKeyPrefix}${file}`, segmentContent);
      console.log(`Uploaded segment: ${file}`);
    }
  }
}

export async function transcodeVideo() {
  // Create a temporary directory with a timestamp
  // const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  // const tempDir = path.join(os.tmpdir(), `hls-${timestamp}`);
  const tempDir = path.join(__dirname, "..", "temp");
  fs.mkdirSync(tempDir, { recursive: true });

  console.log(`Working directory: ${tempDir}`);

  const inputFilePath = path.join(tempDir, "input.mp4");
  console.log(tempDir);

  try {
    // Download the input file first
    console.log("Downloading input file from S3...");
    await downloadFromS3ToLocal(bucketName, inputKey, inputFilePath);
    console.log("Download completed");

    const resolutions = [
      { name: "720p", width: 1280, bitrate: "2500k", audioBitrate: "192k" },
      { name: "1080p", width: 1920, bitrate: "4500k", audioBitrate: "192k" },
      { name: "360p", width: 640, bitrate: "800k", audioBitrate: "128k" },
    ];

    // Process each resolution sequentially
    for (const resolution of resolutions) {
      try {
        await processResolution(resolution, tempDir, inputFilePath);
        console.log(`Completed processing ${resolution.name}`);
      } catch (err) {
        console.error(`Error processing ${resolution.name}:`, err);
        throw err;
      }
    }

    // Cleanup
    console.log("Cleaning up temporary files...");
    fs.rmSync(tempDir, { recursive: true });
    return "Transcoding for all resolutions completed successfully";
  } catch (err) {
    console.error("Transcoding failed:", err);
    // Cleanup on error
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
    throw err;
  }
}
