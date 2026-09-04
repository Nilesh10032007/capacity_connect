import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { Enrollment } from '../models/Enrollment';
import { AuthRequest } from '../middleware/auth';

export const getTrainers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trainers = await User.find({ role: 'trainer' }).select('-passwordHash');
    res.json({ success: true, data: trainers });
  } catch (error) {
    next(error);
  }
};

export const getTrainerDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.find({ trainerId: req.user?.userId });
    
    // Get total learners
    const courseIds = courses.map(c => c._id);
    const enrollments = await Enrollment.find({ courseId: { $in: courseIds } });
    
    res.json({
      success: true,
      data: {
        totalCourses: courses.length,
        totalLearners: enrollments.length,
        courses
      }
    });
  } catch (error) {
    next(error);
  }
};
