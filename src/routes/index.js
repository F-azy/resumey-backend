import { Router } from 'express';
import authRoutes from './auth.routes.js';
import resumeRoutes from './resume.routes.js';
import templateRoutes from './template.routes.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true }));
router.use('/auth', authRoutes);
router.use('/resume', resumeRoutes);
router.use('/templates', templateRoutes);
router.use('/upload', uploadRoutes);

export default router;