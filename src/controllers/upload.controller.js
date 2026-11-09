import { uploadProfileImage } from '../services/cloudinary.service.js';
import { httpError } from '../utils/httpError.js';

export async function profileImage(req, res, next) {
  try {
    if (!req.file) throw httpError(400, 'image is required');
    res.status(201).json(await uploadProfileImage(req.file.buffer));
  } catch (err) {
    next(err);
  }
}
