import { Router } from 'express';
import { getMyCompetencies, getMySkillGaps } from '../controllers/competencyController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/me', authenticateToken, requireRole('trainee'), getMyCompetencies);
router.get('/me/skill-gaps', authenticateToken, requireRole('trainee'), getMySkillGaps);

export default router;
