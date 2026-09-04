import { Router } from 'express';
import { getTrainers, getTrainerDashboard } from '../controllers/trainerController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getTrainers);
router.get('/me/dashboard', authenticateToken, requireRole('trainer'), getTrainerDashboard);

export default router;
