import cloudinary from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { httpError } from '../utils/httpError.js';

export function uploadProfileImage(buffer) {
  const { cloudName, apiKey, apiSecret, folder } = env.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) throw httpError(500, 'Cloudinary is not configured on the server');

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder, // created automatically on first upload
        resource_type: 'image',
        transformation: [{ width: 600, height: 600, crop: 'fill', gravity: 'face' }],
      },
      (err, result) => (err ? reject(httpError(502, err.message)) : resolve({ url: result.secure_url, publicId: result.public_id }))
    );
    stream.end(buffer);
  });
}
