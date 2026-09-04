import { Router } from 'express';
import { 
  getAnnouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement 
} from '../controllers/announcementController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAnnouncements);
router.post('/', authenticateToken, requireRole('admin'), createAnnouncement);
router.put('/:id', authenticateToken, requireRole('admin'), updateAnnouncement);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteAnnouncement);

export default router;
