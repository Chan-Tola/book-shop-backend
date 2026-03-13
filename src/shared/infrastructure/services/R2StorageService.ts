import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize S3 client for R2
const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  s3ForcePathStyle: true,
});
export const uploadFileToR2 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<string> => {
  const bucket = process.env.R2_BUCKET_NAME!;
  const normalizedKey = fileName.startsWith(`${bucket}/`)
    ? fileName.slice(bucket.length + 1)
    : fileName;
  const params = {
    Bucket: bucket,
    Key: normalizedKey,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    await s3.upload(params).promise();
    // Use the Public URL from your .env
    return `${process.env.R2_PUBLIC_URL}/${normalizedKey}`;
  } catch (error) {
    console.error("R2 Error:", error);
    throw new Error("Upload failed");
  }
};

const getKeyFromPublicUrl = (url: string): string | null => {
  const base = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
  const bucket = process.env.R2_BUCKET_NAME || "";
  if (base && url.startsWith(base)) {
    const key = url.slice(base.length).replace(/^\/+/, "");
    return key.startsWith(`${bucket}/`) ? key.slice(bucket.length + 1) : key;
  }
  try {
    const pathname = new URL(url).pathname.replace(/^\/+/, "");
    if (bucket && pathname.startsWith(`${bucket}/`)) {
      return pathname.slice(bucket.length + 1);
    }
    return pathname;
  } catch {
    return null;
  }
};

export const deleteFileFromR2ByUrl = async (url: string): Promise<void> => {
  const bucket = process.env.R2_BUCKET_NAME!;
  const key = getKeyFromPublicUrl(url);
  if (!key) return;

  await s3
    .deleteObject({
      Bucket: bucket,
      Key: key,
    })
    .promise();
};
