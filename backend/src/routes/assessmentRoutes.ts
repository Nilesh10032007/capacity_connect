import { Router } from 'express';
import { 
  getAssessmentsForCourse, 
  getPendingAssessments, 
  getAssessmentQuestions, 
  submitAssessment 
} from '../controllers/assessmentController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/course/:courseId', authenticateToken, getAssessmentsForCourse);
router.get('/me/pending', authenticateToken, requireRole('trainee'), getPendingAssessments);
router.get('/:id/questions', authenticateToken, getAssessmentQuestions);
router.post('/:id/submit', authenticateToken, requireRole('trainee'), submitAssessment);

export default router;
