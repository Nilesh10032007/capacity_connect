import { Request, Response, NextFunction } from 'express';
import { Assessment } from '../models/Assessment';
import { AssessmentQuestion } from '../models/AssessmentQuestion';
import { AssessmentResult } from '../models/AssessmentResult';
import { Certificate } from '../models/Certificate';
import { Enrollment } from '../models/Enrollment';
import { Course } from '../models/Course';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { generateCompetencyQuiz } from '../services/groqService';

export const getAssessmentsForCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assessments = await Assessment.find({ courseId: req.params.courseId });
    res.json({ success: true, data: assessments });
  } catch (error) {
    next(error);
  }
};

// Returns ONLY pending (not yet passed) assessments for trainee
export const getPendingAssessments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const enrollments = await Enrollment.find({ traineeId: req.user?.userId });
    const courseIds = enrollments.map(e => e.courseId);
    
    const assessments = await Assessment.find({ courseId: { $in: courseIds } }).populate('courseId', 'title code');
    
    const results = await AssessmentResult.find({ traineeId: req.user?.userId });
    const passedAssessmentIds = results.filter(r => r.status === 'passed').map(r => r.assessmentId.toString());

    const pending = assessments.filter(a => !passedAssessmentIds.includes(a._id.toString()));
    
    res.json({ success: true, data: pending });
  } catch (error) {
    next(error);
  }
};

// Returns ALL assessments (pending + completed) for trainee with their scores
export const getAllMyAssessments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const enrollments = await Enrollment.find({ traineeId: userId });
    const courseIds = enrollments.map(e => e.courseId);
    
    // Get all assessments for enrolled courses
    const assessments = await Assessment.find({ courseId: { $in: courseIds } }).populate('courseId', 'title code');
    
    // Get all results for this trainee
    const results = await AssessmentResult.find({ traineeId: userId });
    const resultMap = new Map(results.map(r => [r.assessmentId.toString(), r]));

    // Get question counts per assessment
    const assessmentIds = assessments.map(a => a._id);
    const questionCounts = await AssessmentQuestion.aggregate([
      { $match: { assessmentId: { $in: assessmentIds } } },
      { $group: { _id: '$assessmentId', count: { $sum: 1 } } }
    ]);
    const questionCountMap = new Map(questionCounts.map((qc: any) => [qc._id.toString(), qc.count]));

    const formatted = assessments.map(a => {
      const result = resultMap.get(a._id.toString());
      const course = a.courseId as any;
      const totalQuestions = questionCountMap.get(a._id.toString()) || 0;
      
      let status: string = 'available';
      if (result) {
        if (result.status === 'passed' || !a.retakeAllowed) {
          status = 'completed';
        }
      } else if (a.dueDate && new Date(a.dueDate) < new Date()) {
        status = 'overdue';
      } else if (a.dueDate && new Date(a.dueDate) > new Date()) {
        status = 'upcoming';
      }

      return {
        id: a._id,
        title: a.title,
        courseTitle: course?.title || 'Unknown Course',
        courseCode: course?.code || '',
        courseId: course?._id || a.courseId,
        durationMinutes: a.durationMinutes,
        totalQuestions,
        passingScore: a.passingScore,
        difficulty: a.difficulty,
        dueDate: a.dueDate ? new Date(a.dueDate).toISOString().split('T')[0] : undefined,
        completedDate: result?.completedDate ? new Date(result.completedDate).toISOString().split('T')[0] : undefined,
        userScore: result?.score,
        status,
        retakeAllowed: a.retakeAllowed
      };
    });
    
    res.json({ success: true, data: formatted });
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

    if (!assessment.retakeAllowed) {
      const existingResult = await AssessmentResult.findOne({ assessmentId: assessment._id, traineeId: req.user?.userId });
      if (existingResult) {
        return res.status(400).json({ success: false, message: 'You have already completed this assessment. Retakes are not allowed.' });
      }
    }

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
      status,
      answers
    });
    await result.save();

    let certificate = null;
    if (status === 'passed') {
      // Get trainee name for certificate
      const trainee = await User.findById(req.user?.userId);
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

    res.json({ success: true, data: { result, certificate, score, status } });
  } catch (error) {
    next(error);
  }
};

// TRAINER: Create an assessment with questions for a course
export const createAssessmentWithQuestions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId, title, durationMinutes, passingScore, difficulty, dueDate, retakeAllowed, questions } = req.body;

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // Create Assessment
    const assessment = new Assessment({
      courseId,
      title,
      durationMinutes: durationMinutes || 45,
      passingScore: passingScore || 75,
      difficulty: difficulty || 'Medium',
      dueDate: dueDate || undefined,
      retakeAllowed: retakeAllowed !== false
    });
    await assessment.save();

    // Create Questions
    if (questions && Array.isArray(questions) && questions.length > 0) {
      const questionDocs = questions.map((q: any, idx: number) => ({
        assessmentId: assessment._id,
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation || 'Correct based on standard protocols.'
      }));
      await AssessmentQuestion.insertMany(questionDocs);
    }

    res.json({ success: true, data: assessment });
  } catch (error) {
    next(error);
  }
};

// TRAINER: AI-generate questions for an assessment
export const aiGenerateAssessmentQuestions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId, assessmentId, subject, competencyName } = req.body;

    // Use Groq to generate questions
    const questions = await generateCompetencyQuiz(
      competencyName || subject || 'Operational Meteorology',
      subject || 'Meteorology'
    );

    // If assessmentId provided, save them to that assessment
    if (assessmentId) {
      const questionDocs = questions.map((q: any) => ({
        assessmentId,
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation
      }));
      await AssessmentQuestion.insertMany(questionDocs);
    }

    res.json({ success: true, data: { questions } });
  } catch (error) {
    next(error);
  }
};

// TRAINER: Get all assessments created by this trainer (for their courses)
export const getTrainerAssessments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trainerId = req.user?.userId;
    // Find courses where this trainer is the trainer
    const courses = await Course.find({ trainerId });
    const courseIds = courses.map(c => c._id);

    const assessments = await Assessment.find({ courseId: { $in: courseIds } }).populate('courseId', 'title code');

    // Get question counts
    const assessmentIds = assessments.map(a => a._id);
    const questionCounts = await AssessmentQuestion.aggregate([
      { $match: { assessmentId: { $in: assessmentIds } } },
      { $group: { _id: '$assessmentId', count: { $sum: 1 } } }
    ]);
    const questionCountMap = new Map(questionCounts.map((qc: any) => [qc._id.toString(), qc.count]));

    const formatted = assessments.map(a => {
      const course = a.courseId as any;
      return {
        id: a._id,
        title: a.title,
        courseTitle: course?.title || 'Unknown Course',
        courseCode: course?.code || '',
        courseId: course?._id || a.courseId,
        durationMinutes: a.durationMinutes,
        totalQuestions: questionCountMap.get(a._id.toString()) || 0,
        passingScore: a.passingScore,
        difficulty: a.difficulty,
        dueDate: a.dueDate ? new Date(a.dueDate).toISOString().split('T')[0] : undefined,
        retakeAllowed: a.retakeAllowed
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

// TRAINER: Get questions for an assessment (with answers visible for editing)
export const getAssessmentQuestionsForTrainer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const questions = await AssessmentQuestion.find({ assessmentId: req.params.id });
    res.json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

// TRAINER: Update a question
export const updateAssessmentQuestion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { questionText, options, correctOptionIndex, explanation } = req.body;
    const question = await AssessmentQuestion.findByIdAndUpdate(
      req.params.questionId,
      { questionText, options, correctOptionIndex, explanation },
      { new: true }
    );
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// TRAINER: Delete a question
export const deleteAssessmentQuestion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await AssessmentQuestion.findByIdAndDelete(req.params.questionId);
    res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    next(error);
  }
};

export const getAssessmentResponses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await AssessmentResult.find({ assessmentId: req.params.id })
      .populate('traineeId', 'name email employeeId designation');
    
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
