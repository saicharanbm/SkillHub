import { S3 } from "@aws-sdk/client-s3";
import {
  createPresignedPost,
  PresignedPostOptions,
} from "@aws-sdk/s3-presigned-post";
import { v4 as uuid } from "uuid";

if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_REGION ||
  !process.env.BUCKET_NAME
) {
  throw new Error("AWS credentials or bucket name not found");
}

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

export const getSecureUrl = async (
  destination: string,
  ContentType: string,
  maxSize = 2 * 1024 * 1024 // Default max size to 2 MB
) => {
  const bucketName = process.env.BUCKET_NAME;

  if (!bucketName) {
    throw new Error("Bucket name is undefined");
  }

  const id = uuid();
  const params: PresignedPostOptions = {
    Bucket: bucketName,
    Key: `course/${destination}/${id}`, // Matches Fields.key
    Conditions: [
      { "Content-Type": ContentType },
      ["content-length-range", 0, maxSize],
    ],
    Fields: {
      key: `course/${destination}/${id}`, // Matches Key
      "Content-Type": ContentType,
    },
    Expires: 300, // URL expiration in seconds
  };

  const post = await createPresignedPost(s3, params);
  return post;
};
