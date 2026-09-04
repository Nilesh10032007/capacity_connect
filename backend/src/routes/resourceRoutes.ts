import { Router } from 'express';
import { 
  uploadResource, 
  getResources, 
  getCourseResources, 
  deleteResource 
} from '../controllers/resourceController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', authenticateToken, getResources);
router.get('/course/:courseId', authenticateToken, getCourseResources);
router.post('/upload', authenticateToken, requireRole('trainer'), upload.single('file'), uploadResource);
router.delete('/:id', authenticateToken, requireRole('trainer'), deleteResource);

export default router;
