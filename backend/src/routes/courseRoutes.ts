import { Router } from 'express';
import { 
  getCourses, 
  getCourseById, 
  getMyTrainerCourses, 
  createCourse, 
  updateCourse, 
  updateCourseStatus 
} from '../controllers/courseController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getCourses);
router.get('/trainer/me', authenticateToken, requireRole('trainer'), getMyTrainerCourses);
router.get('/:id', authenticateToken, getCourseById);
router.post('/', authenticateToken, requireRole('trainer'), createCourse);
router.put('/:id', authenticateToken, requireRole('trainer'), updateCourse);
router.patch('/:id/status', authenticateToken, requireRole('admin'), updateCourseStatus);

export default router;
