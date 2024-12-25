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
  userType: string,
  userId: string,
  type: string,
  ContentType: string,
  maxSize = 2 * 1024 * 1024 // 2 MB
) => {
  const bucketName = process.env.BUCKET_NAME;
  if (!bucketName) throw new Error("Bucket name is undefined");
  if (!ContentType) throw new Error("ContentType is required");

  const id = uuid();
  const filePath = `temp/${userType}/${id}`;
  const params: PresignedPostOptions = {
    Bucket: bucketName,
    Key: filePath,
    Conditions: [
      { "Content-Type": ContentType },
      ["content-length-range", 0, maxSize],
    ],
    Fields: {
      key: filePath,
      "Content-Type": ContentType,
    },
    Expires: 300,
  };

  const post = await createPresignedPost(s3, params);
  return { ...post, destination: filePath };
};

export const moveFile = async (tempKey: string, destinationKey: string) => {
  const bucketName = process.env.BUCKET_NAME;
  if (!bucketName) throw new Error("Bucket name is undefined");
  if (!tempKey || !destinationKey) {
    throw new Error("Both tempKey and destinationKey are required");
  }

  try {
    await s3.copyObject({
      Bucket: bucketName,
      CopySource: `${bucketName}/${tempKey}`,
      Key: destinationKey,
    });

    await s3.deleteObject({
      Bucket: bucketName,
      Key: tempKey,
    });

    console.log(`File moved from ${tempKey} to ${destinationKey}`);
  } catch (error) {
    console.error(
      `Error moving file from ${tempKey} to ${destinationKey}:`,
      error
    );
    throw error;
  }
};
