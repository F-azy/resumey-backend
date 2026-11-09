import multer from 'multer';
import { httpError } from '../utils/httpError.js';

const build = (field, maxMb, filter, message) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxMb * 1024 * 1024 },
    fileFilter: (_req, file, cb) => (filter(file) ? cb(null, true) : cb(new Error(message))),
  }).single(field);

  return (req, res, next) =>
    upload(req, res, (err) => (err ? next(httpError(400, err.code === 'LIMIT_FILE_SIZE' ? `File is larger than ${maxMb} MB` : err.message)) : next()));
};

export const uploadImage = build('image', 5, (f) => /^image\/(jpeg|png|webp)$/.test(f.mimetype), 'Only JPG, PNG or WebP images are allowed');
export const uploadResumeFile = build('file', 8, (f) => /\.(pdf|docx|txt)$/i.test(f.originalname), 'Upload a PDF, DOCX or TXT file');
