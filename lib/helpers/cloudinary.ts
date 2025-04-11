import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: unknown;
}

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<CloudinaryUploadResult> {
  // Convert file to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `megashop/${folder}` },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result as CloudinaryUploadResult);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image: ${publicId}`);
  } catch (error) {
    console.error(`Failed to delete image ${publicId}:`, error);
  }
}
