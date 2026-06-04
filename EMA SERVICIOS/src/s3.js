const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION
});

async function subirFotoAS3({ buffer, nombreArchivo, contentType }) {
  const bucket = process.env.S3_BUCKET_NAME;

  if (!bucket) {
    throw new Error("Falta S3_BUCKET_NAME");
  }

  const key = `whatsapp/${Date.now()}-${nombreArchivo}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType || "image/jpeg"
    })
  );

  return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = {
  subirFotoAS3
};
