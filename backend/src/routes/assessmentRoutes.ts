import { Router } from 'express';
import { 
  getAssessmentsForCourse, 
  getPendingAssessments, 
  getAllMyAssessments,
  getAssessmentQuestions, 
  submitAssessment,
  createAssessmentWithQuestions,
  aiGenerateAssessmentQuestions,
  getTrainerAssessments,
  getAssessmentQuestionsForTrainer,
  updateAssessmentQuestion,
  deleteAssessmentQuestion,
  getAssessmentResponses
} from '../controllers/assessmentController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Trainee routes
router.get('/me/all', authenticateToken, requireRole('trainee'), getAllMyAssessments);
router.get('/me/pending', authenticateToken, requireRole('trainee'), getPendingAssessments);
router.get('/:id/questions', authenticateToken, getAssessmentQuestions);
router.post('/:id/submit', authenticateToken, requireRole('trainee'), submitAssessment);

// Trainer routes
router.get('/trainer/my', authenticateToken, requireRole('trainer'), getTrainerAssessments);
router.get('/trainer/:id/questions', authenticateToken, requireRole('trainer'), getAssessmentQuestionsForTrainer);
router.get('/:id/responses', authenticateToken, requireRole('trainer'), getAssessmentResponses);
router.post('/create', authenticateToken, requireRole('trainer'), createAssessmentWithQuestions);
router.post('/ai-generate', authenticateToken, requireRole('trainer'), aiGenerateAssessmentQuestions);
router.put('/questions/:questionId', authenticateToken, requireRole('trainer'), updateAssessmentQuestion);
router.delete('/questions/:questionId', authenticateToken, requireRole('trainer'), deleteAssessmentQuestion);

// General
router.get('/course/:courseId', authenticateToken, getAssessmentsForCourse);

export default router;
