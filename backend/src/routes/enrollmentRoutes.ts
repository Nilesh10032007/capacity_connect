import { Router } from 'express';
import { enrollInCourse, updateModuleProgress, getMyEnrollments } from '../controllers/enrollmentController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Used in Course routes as /api/courses/:id/enroll
// But let's export just the controllers, or define routes here:
router.post('/courses/:id/enroll', authenticateToken, requireRole('trainee'), enrollInCourse);
router.get('/trainees/me/enrollments', authenticateToken, requireRole('trainee'), getMyEnrollments);
router.patch('/enrollments/:id/modules/:moduleId', authenticateToken, requireRole('trainee'), updateModuleProgress);

export default router;
