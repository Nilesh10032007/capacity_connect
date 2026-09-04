import { Router } from 'express';
import { submitFeedback, getTrainerFeedback } from '../controllers/feedbackController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.post('/course/:courseId', authenticateToken, requireRole('trainee'), submitFeedback);
router.get('/trainer/me', authenticateToken, requireRole('trainer'), getTrainerFeedback);

export default router;
