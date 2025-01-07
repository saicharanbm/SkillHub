import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import os from "os";
import { Readable } from "stream";

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

async function getS3Stream(bucket: string, key: string): Promise<Readable> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3.send(command);
  return response.Body as Readable;
}

export async function transcodeVideo() {
  const inputStream = await getS3Stream(bucketName, inputKey);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hls-"));

  return new Promise((resolve, reject) => {
    ffmpeg(inputStream)
      .outputOptions([
        "-vf",
        "scale=640:-2", // Scale the width to 640 and auto-adjust height to maintain aspect ratio
        "-c:v",
        "h264",
        "-b:v",
        "800k",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-hls_time",
        "10",
        "-hls_playlist_type",
        "vod",
        "-hls_segment_filename",
        path.join(tempDir, "360p_%03d.ts"),
      ])
      .output(path.join(tempDir, "360p.m3u8"))
      .on("end", async () => {
        try {
          // Upload playlist file
          const playlistContent = fs.readFileSync(
            path.join(tempDir, "360p.m3u8")
          );
          await uploadToS3(
            bucketName,
            `${outputKeyPrefix}360p.m3u8`,
            playlistContent
          );

          // Upload all segment files
          const files = fs.readdirSync(tempDir);
          for (const file of files) {
            if (file.endsWith(".ts")) {
              const segmentContent = fs.readFileSync(path.join(tempDir, file));
              await uploadToS3(
                bucketName,
                `${outputKeyPrefix}${file}`,
                segmentContent
              );
            }
          }

          // Cleanup
          fs.rmSync(tempDir, { recursive: true });
          resolve("Transcoding completed");
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => {
        fs.rmSync(tempDir, { recursive: true });
        reject(err);
      })
      .run();
  });
}
