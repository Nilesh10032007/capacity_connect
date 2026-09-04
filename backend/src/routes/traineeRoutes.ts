import { Router } from 'express';
import { getDashboard } from '../controllers/traineeController';
import { authenticateToken, requireRole } from '../middleware/auth';
// Other routes like getMyCompetencies and getMySkillGaps are in competencyRoutes 
// But the prompt specified:
// GET /api/trainees/me/dashboard
// GET /api/trainees/me/competencies
// GET /api/trainees/me/skill-gaps
// Let's import those from competencyController

import { getMyCompetencies, getMySkillGaps, updateMyCompetencyLevel, getCompetencyQuiz } from '../controllers/competencyController';
import { getMyEnrollments } from '../controllers/enrollmentController';

const router = Router();

router.get('/me/dashboard', authenticateToken, requireRole('trainee'), getDashboard);
router.get('/me/competencies', authenticateToken, requireRole('trainee'), getMyCompetencies);
router.post('/me/competencies/level', authenticateToken, requireRole('trainee'), updateMyCompetencyLevel);
router.post('/me/competencies/generate-quiz', authenticateToken, requireRole('trainee'), getCompetencyQuiz);
router.get('/me/skill-gaps', authenticateToken, requireRole('trainee'), getMySkillGaps);
router.get('/me/enrollments', authenticateToken, requireRole('trainee'), getMyEnrollments);

export default router;
