import { Router } from 'express';
import { generate, compile, list, getOne, remove } from '../controllers/resume.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/generate', generate);
router.post('/compile', compile);
router.get('/', list);
router.get('/:id', getOne);
router.delete('/:id', remove);

export default router;
