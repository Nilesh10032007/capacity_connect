import { Router } from 'express';
import { getMyCertificates } from '../controllers/certificateController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/me', authenticateToken, requireRole('trainee'), getMyCertificates);

export default router;
