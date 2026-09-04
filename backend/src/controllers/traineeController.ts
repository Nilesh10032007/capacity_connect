import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Enrollment } from '../models/Enrollment';
import { AuthRequest } from '../middleware/auth';

export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.userId).select('readinessScore completionPercentage');
    
    // Enrollments
    const enrollments = await Enrollment.find({ traineeId: req.user?.userId }).populate('courseId');
    
    res.json({
      success: true,
      data: {
        readinessScore: user?.readinessScore || 0,
        completionPercentage: user?.completionPercentage || 0,
        enrollments
      }
    });
  } catch (error) {
    next(error);
  }
};
