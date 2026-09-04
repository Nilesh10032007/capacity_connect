import { Request, Response, NextFunction } from 'express';
import { Assessment } from '../models/Assessment';
import { AssessmentQuestion } from '../models/AssessmentQuestion';
import { AssessmentResult } from '../models/AssessmentResult';
import { Certificate } from '../models/Certificate';
import { Enrollment } from '../models/Enrollment';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

export const getAssessmentsForCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assessments = await Assessment.find({ courseId: req.params.courseId });
    res.json({ success: true, data: assessments });
  } catch (error) {
    next(error);
  }
};

export const getPendingAssessments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const enrollments = await Enrollment.find({ traineeId: req.user?.userId });
    const courseIds = enrollments.map(e => e.courseId);
    
    // Find assessments for enrolled courses
    const assessments = await Assessment.find({ courseId: { $in: courseIds } });
    
    // Check results
    const results = await AssessmentResult.find({ traineeId: req.user?.userId });
    const passedAssessmentIds = results.filter(r => r.status === 'passed').map(r => r.assessmentId.toString());

    const pending = assessments.filter(a => !passedAssessmentIds.includes(a._id.toString()));
    
    res.json({ success: true, data: pending });
  } catch (error) {
    next(error);
  }
};

export const getAssessmentQuestions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const questions = await AssessmentQuestion.find({ assessmentId: req.params.id })
      .select('-correctOptionIndex -explanation'); // Hide answers!
    res.json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

export const submitAssessment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { answers } = req.body; // { questionId: selectedIndex }
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    const questions = await AssessmentQuestion.find({ assessmentId: assessment._id });
    
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q._id.toString()] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const status = score >= assessment.passingScore ? 'passed' : 'failed';

    const result = new AssessmentResult({
      assessmentId: assessment._id,
      traineeId: req.user?.userId,
      score,
      status
    });
    await result.save();

    let certificate = null;
    if (status === 'passed') {
      certificate = new Certificate({
        certificateCode: `IMD-CAP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        courseId: assessment.courseId,
        traineeId: req.user?.userId,
        issuingAuthority: 'India Meteorological Department (IMD) & MoES',
        grade: score >= 90 ? `Distinction (${score}%)` : `Passed (${score}%)`,
        verificationUrl: `https://capacityconnect.moes.gov.in/verify/${uuidv4()}`
      });
      await certificate.save();
    }

    res.json({ success: true, data: { result, certificate } });
  } catch (error) {
    next(error);
  }
};
