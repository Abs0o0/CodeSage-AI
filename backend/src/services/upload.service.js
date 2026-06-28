import cloudinary from "../config/cloudinary.js";

export function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "codesage/avatars",
        resource_type: "image",
        overwrite: true,
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId) {
  if (!publicId) return null;

  return cloudinary.uploader.destroy(publicId);
}