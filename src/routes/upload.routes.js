import { Router } from 'express';
import { profileImage } from '../controllers/upload.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/profile-image', requireAuth, uploadImage, profileImage);

export default router;
