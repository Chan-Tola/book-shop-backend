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
  const params = {
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    await s3.upload(params).promise();
    // Use the Public URL from your .env
    return `${process.env.R2_PUBLIC_URL}/${fileName}`;
  } catch (error) {
    console.error("R2 Error:", error);
    throw new Error("Upload failed");
  }
};
