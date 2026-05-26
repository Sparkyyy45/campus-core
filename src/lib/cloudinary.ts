// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("Missing CLOUDINARY_CLOUD_NAME");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Generates a time-limited signed URL for a private asset.
 * Since assets are uploaded as delivery type "upload", we explicitly pass type: "upload".
 * @param publicId The public ID of the asset in Cloudinary
 * @param expiresAt Unix timestamp in seconds for when the URL expires
 * @param download Whether to trigger an automatic file download attachment in the browser
 */
export function getSignedUrl(publicId: string, expiresAt: number, download: boolean = false) {
  return cloudinary.utils.private_download_url(publicId, "", {
    resource_type: "raw",
    type: "upload",
    expires_at: expiresAt,
    ...(download ? { attachment: true } : {}),
  });
}
