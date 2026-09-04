import { Router } from 'express';
import { getTrainers, getTrainerDashboard, getTrainerTrainees } from '../controllers/trainerController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getTrainers);
router.get('/me/dashboard', authenticateToken, requireRole('trainer'), getTrainerDashboard);
router.get('/me/trainees', authenticateToken, requireRole('trainer'), getTrainerTrainees);

export default router;
