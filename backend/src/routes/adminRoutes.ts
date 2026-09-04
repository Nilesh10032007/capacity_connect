import { Router } from 'express';
import { 
  getDashboardKPIs, 
  getCompetencyHeatmap, 
  matchTrainers 
} from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticateToken, requireRole('admin'), getDashboardKPIs);
router.get('/analytics/competency-heatmap', authenticateToken, requireRole('admin'), getCompetencyHeatmap);
router.post('/trainers/match', authenticateToken, requireRole('admin'), matchTrainers);

export default router;
