import { Router } from 'express';
import { parse, generate, list, getOne, update, pdf, remove } from '../controllers/resume.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadResumeFile } from '../middleware/upload.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/parse', uploadResumeFile, parse);
router.post('/generate', generate);
router.get('/', list);
router.get('/:id', getOne);
router.put('/:id', update);
router.post('/:id/pdf', pdf);
router.delete('/:id', remove);

export default router;
